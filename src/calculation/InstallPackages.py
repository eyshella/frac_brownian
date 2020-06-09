from pip._internal import main

def import_or_install(package):
    try:
        __import__(package)
    except ImportError:
        main(['install', package])
        __import__(package)

import_or_install('scipy')
import_or_install('matplotlib')
import_or_install('numpy')