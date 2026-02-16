from sqlalchemy import select

from app.core.db import get_session_maker
from app.core.security import get_password_hash
from app.models.household import Household, HouseholdMember
from app.models.user import User


SEED_USERS = [
    {"id": 1, "email": "me@myasset.local", "display_name": "Me", "password": "pass1234", "role": "ADMIN"},
    {"id": 2, "email": "wife@myasset.local", "display_name": "Wife", "password": "pass1234", "role": "USER"},
    {"id": 3, "email": "son@myasset.local", "display_name": "Son", "password": "pass1234", "role": "USER"},
]


def run() -> None:
    session = get_session_maker()()
    try:
        for item in SEED_USERS:
            user = session.scalar(select(User).where(User.id == item["id"]))
            if user is None:
                user = User(
                    id=item["id"],
                    email=item["email"],
                    display_name=item["display_name"],
                    password_hash=get_password_hash(item["password"]),
                    is_active=True,
                    role=item["role"],
                    status="ACTIVE",
                    must_change_password=False,
                )
                session.add(user)
            else:
                user.email = item["email"]
                user.display_name = item["display_name"]
                user.password_hash = get_password_hash(item["password"])
                user.is_active = True
                user.role = item["role"]
                user.status = "ACTIVE"
                user.must_change_password = False

        household = session.scalar(select(Household).where(Household.id == 1))
        if household is None:
            household = Household(id=1, name="My Household")
            session.add(household)
        else:
            household.name = "My Household"

        session.flush()

        for item in SEED_USERS:
            exists = session.scalar(
                select(HouseholdMember).where(
                    HouseholdMember.household_id == 1,
                    HouseholdMember.user_id == item["id"],
                )
            )
            if exists is None:
                role = "OWNER" if item["id"] == 1 else "MEMBER"
                session.add(HouseholdMember(household_id=1, user_id=item["id"], role=role))

        session.commit()
        print("SEED_OK users=3 household=1 memberships=3")
    finally:
        session.close()


if __name__ == "__main__":
    run()