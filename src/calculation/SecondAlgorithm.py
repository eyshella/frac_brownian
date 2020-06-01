import math
import random
import json
import sys
import gc


random.seed()


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


def Poisson(T, l):
    result = []
    a = random.random()
    sigma = -math.log(a)/l
    result.append(sigma)
    while sigma < T:
        a = random.random()
        sigma = sigma - math.log(a)/l
        result.append(sigma)
    return result


def FractionalBrownianMotion(H, tetta, T):
    x = 2-2*H
    l = Gamma(x)*tetta
    poisson = Poisson(T, l)
    L = len(poisson)
    randomArray = []
    for i in range(L):
        r = (random.random()-1/2)*math.sqrt(6*(2-x)*(1-x)*(tetta**x))
        randomArray.append(r)
    result = [{
        'x': 0,
        'y': 0
    }]

    for i in range(L):
        result.append({
            'x': poisson[i],
            'y': randomArray[i]
        })

    return result


H = float(sys.argv[1])
tetta = int(sys.argv[2])
T = 1

result = FractionalBrownianMotion(H, tetta, T)

print(json.dumps({'points': result}, separators=(',', ':')))
