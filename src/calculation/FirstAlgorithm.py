import math
import random
import json
import sys

random.seed()


def StandartNormal():
    u = 0
    v = 0
    while (u == 0):
        u = random.random()  # Converting [0,1) to (0,1)
    while (v == 0):
        v = random.random()  # Converting [0,1) to (0,1)
    return math.sqrt(-2.0 * math.log(u)) * math.cos(2.0 * math.pi * v)


def FractionalBrownianNoiseKernel(x, H):
    if x > 1:
        return x**(H-0.5) - (x-1)**(H-0.5)
    elif x > 0 and x <= 1:
        return x**(H-0.5)


def FractionalBrownianNoise(H, m, M, randomArray, j):
    result = 0
    for i in range(M*m):
        n = i+1
        result = result + FractionalBrownianNoiseKernel(
            n / m, H) * randomArray[(j + M) * m - n]
    return result


def FractionalBrownianMotion(H, T, m, M):
    randomArray = []
    for i in range(m*(T*M)-1):
        randomArray.append(StandartNormal())

    noiseArray = []

    for i in range(T):
        noiseArray.append(FractionalBrownianNoise(H, m, M, randomArray, i+1))

    result = [
        {
            'x': 0,
            'y': 0
        }
    ]

    for i in range(T):
        noiseSum = 0
        for j in range(i+1):
          noiseSum+=noiseArray[j]
        
        result.append({
            'x': (i+1)/T,
            'y': (T**(-H))*noiseSum
        })
    return result


H = float(sys.argv[1])
T = int(sys.argv[2])
m = int(sys.argv[3])
M = int(sys.argv[4])

result = FractionalBrownianMotion(H, T, m, M)

print(json.dumps({'result': result}, separators=(',', ':')))
