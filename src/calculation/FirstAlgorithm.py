import math
import random
import json
import sys
import os
import time
import gc
from scipy.integrate import quad

random.seed()


def SaveResultToFileAsJSON(x, y):
    ts = time.time()
    file_path = os.path.abspath("./output/FirstAlgorithm-"+str(ts)+".json")
    directory = os.path.dirname(file_path)
    try:
        os.stat(directory)
    except:
        os.mkdir(directory)
    file = open(file_path, 'w+')

    json.dump({'x': x, 'y': y}, file, separators=(',', ':'))
    return file_path


def StandartNormal():
    u = 0
    v = 0
    while (u == 0):
        u = random.random()  # Converting [0,1) to (0,1)
    while (v == 0):
        v = random.random()  # Converting [0,1) to (0,1)
    return (-2 * math.log(u))**0.5 * math.cos(2 * math.pi * v)


def FractionalBrownianNoiseKernel(x, H):
    if x > 1:
        return x**(H-0.5) - (x-1)**(H-0.5)
    elif x > 0 and x <= 1:
        return x**(H-0.5)


def FractionalBrownianNoise(H, m, M, randomArray, j):
    result = 0
    for i in range(M*m):
        n = i+1
        result = result + \
            FractionalBrownianNoiseKernel(
                n / m, H) * randomArray[(j + M) * m - n]
    return result


def ConstantIntegral(x, H):
    return ((1+x)**(H-1/2) - x**(H-1/2))**2


def CalculateConstant(H):
    integral = quad(ConstantIntegral, 0, float('inf'),
                    args=(H))  # Calculating integral
    return (integral[0]+1/(2*H))**0.5


def FractionalBrownianMotion(H, T, m, M):
    randomArray = []
    for i in range(m*(T+M)):
        randomArray.append(StandartNormal())
    noiseArray = []

    for i in range(T):
        noiseArray.append(FractionalBrownianNoise(H, m, M, randomArray, i+1))
        if(i % 50 == 0):
            gc.collect()  # To avoid huge RAM usage

    x = [0]
    y = [0]

    constant = CalculateConstant(H)
    for i in range(T):
        noiseSum = 0
        for j in range(i+1):
            noiseSum += noiseArray[j]

        x.append((i+1)/T)
        y.append((T**(-H))*noiseSum/(constant*m**0.5))
    return x, y


H = float(sys.argv[1])
T = int(sys.argv[2])
m = int(sys.argv[3])
M = int(sys.argv[4])

x, y = FractionalBrownianMotion(H, T, m, M)

fileName = SaveResultToFileAsJSON(x, y)
print(json.dumps({'filePath': fileName}))
