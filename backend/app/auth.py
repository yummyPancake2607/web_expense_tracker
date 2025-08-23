import httpx
from jose import jwt
from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials

# Replace with your actual Clerk domain!!
CLERK_ISSUER = "https://<your-clerk-frontend-api>.clerk.accounts.dev"
CLERK_JWKS_URL = f"{CLERK_ISSUER}/.well-known/jwks.json"

security = HTTPBearer()
jwks_cache = None

async def get_clerk_public_keys():
    global jwks_cache
    if jwks_cache is None:
        async with httpx.AsyncClient() as client:
            resp = await client.get(CLERK_JWKS_URL)
            resp.raise_for_status()
            jwks_cache = resp.json()["keys"]
    return jwks_cache

async def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(security)):
    token = credentials.credentials
    headers = jwt.get_unverified_header(token)
    jwks = await get_clerk_public_keys()

    public_key = None
    for key in jwks:
        if key["kid"] == headers["kid"]:
            public_key = jwt.construct_rsa_public_key(key)
            break

    if not public_key:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Public key not found for token.")

    try:
        payload = jwt.decode(token, public_key, issuer=CLERK_ISSUER, algorithms=["RS256"])
        return {"clerk_id": payload["sub"], "email": payload.get("email")}
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail=f"Invalid credentials: {e}")