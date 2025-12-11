"""create chats table

Revision ID: abe0ae20eea9
Revises: 76fce4a27b0d
Create Date: 2025-12-12 01:53:42.035118

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = 'abe0ae20eea9'
down_revision: Union[str, Sequence[str], None] = '76fce4a27b0d'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""
    pass


def downgrade() -> None:
    """Downgrade schema."""
    pass
