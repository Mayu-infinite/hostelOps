from .users import router as users_router
try:
	from .complaints import router as complaints_router
except Exception:
	# complaints router may not exist yet during initial setup
	complaints_router = None
