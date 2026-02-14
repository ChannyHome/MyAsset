from dataclasses import dataclass

from app.core.security import get_password_hash


@dataclass
class SeedUser:
    id: int
    email: str
    display_name: str
    password_hash: str


# MVP 개발용 시드 계정. 3단계(DB 도입)에서 users 테이블 조회로 교체한다.
_seed_plain_users = [
    {"id": 1, "email": "me@myasset.local", "display_name": "Me", "password": "pass1234"},
    {"id": 2, "email": "wife@myasset.local", "display_name": "Wife", "password": "pass1234"},
    {"id": 3, "email": "son@myasset.local", "display_name": "Son", "password": "pass1234"},
]

SEED_USERS: dict[str, SeedUser] = {
    item["email"]: SeedUser(
        id=item["id"],
        email=item["email"],
        display_name=item["display_name"],
        password_hash=get_password_hash(item["password"]),
    )
    for item in _seed_plain_users
}



def find_user_by_email(email: str) -> SeedUser | None:
    return SEED_USERS.get(email)



def find_user_by_id(user_id: int) -> SeedUser | None:
    for user in SEED_USERS.values():
        if user.id == user_id:
            return user
    return None