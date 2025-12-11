"""create users projects chats tables

Revision ID: 76fce4a27b0d
Revises: e92df0eba6a2
Create Date: 2025-12-12 01:48:14.423819

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '76fce4a27b0d'
down_revision: Union[str, Sequence[str], None] = 'e92df0eba6a2'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""
    pass


def downgrade() -> None:
    """Downgrade schema."""
    pass
