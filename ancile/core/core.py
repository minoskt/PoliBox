from ancile.core.primitives.result import Result
from RestrictedPython import safe_builtins
from RestrictedPython.Eval import default_guarded_getitem
import traceback
import redis
from collections import namedtuple
from config.loader import REDIS_CONFIG
import logging
from ancile.core.context_building import assemble_locals
from ancile.core.advanced.caching import retrieve_compiled
from ancile.core.advanced.storage import Storage

logger = logging.getLogger(__name__)

UserInfoBundle = namedtuple("UserInfoBundle", ['username', 'policies',
                                               'tokens', 'private_data'])


def execute(users_secrets, program, app_id=None, app_module=None, data_policy_pairs=None):
    r = redis.Redis(**REDIS_CONFIG)
    storage = Storage(redis_conneciton=r)
    json_output = dict()
    # object to interact with the program
    result = Result()

    glbls = {'__builtins__': safe_builtins,
             '_getitem_': default_guarded_getitem
             }

    lcls = assemble_locals(storage=storage, result=result,
                           users_secrets=users_secrets,
                           app_id=app_id,
                           app_module=app_module,
                           data_policy_pairs=data_policy_pairs or list(),
                           )
    try:
        c_program = retrieve_compiled(program, r)
        exec(c_program, glbls, lcls)

    except:
        print(traceback.format_exc())
        json_output = {'result': 'error', 'traceback': traceback.format_exc()}
        return json_output

    json_output['stored_items'] = result._stored_keys
    json_output['encrypted_data'] = result._encrypted_data
    json_output['data'] = result._dp_pair_data
    json_output['execution_log'] = result._execution_logs
    json_output['result'] = 'ok'
    return json_output
