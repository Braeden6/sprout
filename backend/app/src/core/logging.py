import inspect
import logging

logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - [%(name)s:%(funcName)s:%(lineno)d] - %(message)s')

logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - [%(name)s:%(funcName)s:%(lineno)d] - %(message)s'
)

def get_logger():
    """Get a logger instance using the caller's module name."""
    caller_frame = inspect.currentframe().f_back
    caller_name = caller_frame.f_globals['__name__']
    return logging.getLogger(caller_name)