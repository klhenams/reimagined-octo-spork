from passlib.context import CryptContext

context = CryptContext(schemes=["argon2"])


def get_hash(string: str) -> str:
    return context.hash(string)


def string_matches_hashed(plain: str, hashed: str) -> bool:
    return context.verify(secret=plain, hash=hashed)
