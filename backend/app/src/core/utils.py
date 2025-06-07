from fastapi import APIRouter
from app.src.core.logging import get_logger
import importlib
from pathlib import Path
from types import ModuleType

logger = get_logger()

def get_all_routers() -> list[APIRouter]:
    routers = []
    features_dir = Path(__file__).parent.parent / "features"
    for feature_dir in features_dir.iterdir():
        if not feature_dir.is_dir():
            continue
        router_file = feature_dir / "api.py"
        if router_file.exists():
            module_path = f"app.src.features.{feature_dir.name}.api"
            router_module = importlib.import_module(module_path)
            
            if hasattr(router_module, "router"):
                routers.append(router_module.router)
            else:
                logger.info(f"No router found in {feature_dir}")
                
    return routers

def get_all_models() -> list[ModuleType]:
    imported_modules = []
    features_dir = Path(__file__).parent.parent / "features"
    
    for feature_dir in features_dir.iterdir():
        if not feature_dir.is_dir():
            continue
        
        model_file = feature_dir / "model.py"
        print(model_file, model_file.exists())
        if model_file.exists():
            try:
                module_path = f"app.src.features.{feature_dir.name}.model"
                module = importlib.import_module(module_path)
                imported_modules.append(module)
                logger.debug(f"Imported model from {module_path}")
            except Exception as e:
                logger.error(f"Failed to import model from {feature_dir}: {e}")
    return imported_modules

    