from __future__ import with_statement
import re
from fabric.api import run, cd, env

env.hosts = ['selfcontained.us']

def publish():
	with cd('/data/www/selfcontained'):
		run('git pull')
		run('flipflop generate')
	print('changes published')