import math
import random
import json
import sys
import gc


def StandartNormal():
    u = 0
    v = 0
    while (u == 0):
        u = random.random()  # Converting [0,1) to (0,1)
    while (v == 0):
        v = random.random()  # Converting [0,1) to (0,1)
    return (-2 * math.log(u))**0.5 * math.cos(2 * math.pi * v)


def Gamma(shape):
    if shape == 1/2:
        N = StandartNormal()
        return (1/2)*(N**2)
    c = 1/shape
    d = shape**(shape/(1-shape))*(1-shape)
    while True:
        z = - math.log(random.random())
        e = - math.log(random.random())
        x = z**c
        if z+e <= d+x:
            return x
