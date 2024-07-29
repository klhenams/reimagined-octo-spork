from fastapi.security import OAuth2PasswordBearer

super_admin_scheme = OAuth2PasswordBearer(
    tokenUrl="/super-admins/authenticate",
    scheme_name="Super Admins",
)
