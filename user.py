import datetime

class User:
    """User model for ARIA application"""
    
    def __init__(self, email, password_hash, display_name=None):
        self.email = email
        self.password_hash = password_hash
        self.display_name = display_name or email.split('@')[0]
        self.created_at = datetime.datetime.utcnow()
        self.updated_at = datetime.datetime.utcnow()
    
    def to_dict(self):
        """Convert user object to dictionary for MongoDB storage"""
        return {
            'email': self.email,
            'password_hash': self.password_hash,
            'display_name': self.display_name,
            'created_at': self.created_at,
            'updated_at': self.updated_at
        }
    
    @classmethod
    def from_dict(cls, data):
        """Create user object from dictionary"""
        user = cls(
            email=data.get('email'),
            password_hash=data.get('password_hash'),
            display_name=data.get('display_name')
        )
        user.created_at = data.get('created_at', datetime.datetime.utcnow())
        user.updated_at = data.get('updated_at', datetime.datetime.utcnow())
        return user
    
    def update_display_name(self, new_display_name):
        """Update user display name"""
        self.display_name = new_display_name
        self.updated_at = datetime.datetime.utcnow()
    
    def update_password(self, new_password_hash):
        """Update user password"""
        self.password_hash = new_password_hash
        self.updated_at = datetime.datetime.utcnow()
