import math
import random
import os
import json
import sys
import time
import gc


random.seed()


def SaveResultToFileAsJSON(x, y):
    ts =time.time()
    file_path = os.path.abspath(os.path.dirname(os.path.realpath(__file__))+"/SecondAlgorithm-"+str(ts)+".json")
    directory = os.path.dirname(file_path)
    try:
        os.stat(directory)
    except:
        os.mkdir(directory)  
    file = open(file_path, 'w+')

    json.dump({'x': x, 'y':y},file,separators=(',', ':'))
    return file_path


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
    i = 0
    while True:
        i += 1
        if(i % 100000 == 0):
            gc.collect()  # To avoid huge RAM usage

        z = - math.log(random.random())
        e = - math.log(random.random())
        x = z**c
        if z+e <= d+x:
            return x


def SpecificRandomArray(x, L):
    randomArray = []
    for i in range(L):
        if(i % 1000000 == 0):
            gc.collect()  # To avoid huge RAM usage

        r = (random.random()-1/2)*math.sqrt(6*(2-x)*(1-x)*(tetta**x))
        randomArray.append(r)
    return randomArray


def Poisson(T, l):
    result = [0]
    sigma = 0
    i = 0
    while sigma < T:
        i += 1
        if(i % 1000000 == 0):
            gc.collect()  # To avoid huge RAM usage

        a = random.random()
        sigma = sigma - math.log(a)/l

        if(sigma > T):
            sigma = T

        result.append(sigma)
    return result


def ConvertAllDataToBrownian(randomArray, poisson):
    L = len(poisson)

    result = [0]

    for i in range(L-1):
        if(i % 1000000 == 0):
            gc.collect()  # To avoid huge RAM usage
        poissonDelta = poisson[i+1]

        if i != 0:
            poissonDelta -= poisson[i]

        result.append(randomArray[i]*poissonDelta + result[len(result)-1])

    return result


def FractionalBrownianMotion(H, tetta, T):
    x = 2-2*H
    l = Gamma(x)*tetta

    poisson = Poisson(T, l)

    L = len(poisson)

    randomArray = SpecificRandomArray(x, L)

    result = ConvertAllDataToBrownian(randomArray, poisson)

    return poisson, result


H = float(sys.argv[1])
tetta = int(sys.argv[2])
T = 1

x, y = FractionalBrownianMotion(H, tetta, T)

fileName = SaveResultToFileAsJSON(x, y)
print(json.dumps({'filePath':fileName}))
