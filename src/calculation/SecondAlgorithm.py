import math
import random
import os
import json
import sys
import time
import matplotlib.pyplot as plt
import numpy as np
from matplotlib import cm
import gc


random.seed()


def SaveResultToFileAsJSON(x, y):
    ts = time.time()
    file_path = os.path.abspath(os.path.dirname(
        os.path.realpath(__file__))+"/SecondAlgorithm-"+str(ts)+".json")
    directory = os.path.dirname(file_path)
    try:
        os.stat(directory)
    except:
        os.mkdir(directory)
    file = open(file_path, 'w+')

    json.dump({'x': x, 'y': y}, file, separators=(',', ':'))
    return file_path


def CreateResultChartFile(X, Y):
    ts = time.time()
    file_path = os.path.abspath(os.path.dirname(
        os.path.realpath(__file__))+"/SecondAlgorithm-"+str(ts)+".png")
    fig, ax = plt.subplots(dpi=600, frameon=False)
    ax.spines['top'].set_visible(False)
    ax.spines['right'].set_visible(False)
    for i in range(len(X)):
        ax.plot(X[i], Y[i],color='#f50057',linewidth=0.3)

    fig.savefig(file_path)
    return file_path

def CreateResult3dChartFile(x, y, z):
    ts = time.time()
    file_path = os.path.abspath(os.path.dirname(
        os.path.realpath(__file__))+"/SecondAlgorithm-"+str(ts)+".png")
    fig = plt.figure(dpi=600)
    ax = fig.gca(projection='3d')
    X, Y = np.meshgrid(x, y)

    surf = ax.plot_surface(X,Y,np.array(z), cmap=cm.coolwarm,linewidth=0, antialiased=False)
    fig.colorbar(surf, shrink=0.5, aspect=5)

    fig.savefig(file_path)
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


def GetValueInPoint(x, y, point):
    k = 0
    while k < len(x) and x[k] < point:
        k = k+1

    if k == 0:
        return y[0]
    return ((x[k]*y[k-1]-x[k-1]*y[k]) + (y[k]-y[k-1])*point)/(x[k]-x[k-1])


def Mean(X, Y, point):
    sum = 0
    for i in range(len(X)):
        sum = sum+GetValueInPoint(X[i], Y[i], point)
    return sum/len(X)


def CovarianceCoefficient(X, Y, point1, point2, mean1, mean2):
    sum = 0
    for i in range(len(X)):
        value1 = GetValueInPoint(X[i], Y[i], point1)
        value2 = GetValueInPoint(X[i], Y[i], point2)
        sum = sum+(value1-mean1)*(value2-mean2)
    return sum/len(X)


def CalculateProcessParams(X, Y, ParamsT):
    mean = []
    covariance = []
    x = []
    for i in range(ParamsT+1):
        point = i/ParamsT
        x.append(point)
        mean.append(Mean(X, Y, point))

    for i in range(ParamsT+1):
        iconvariance = []
        for j in range(ParamsT + 1):
            point1 = i/ParamsT
            point2 = j/ParamsT
            iconvariance.append(CovarianceCoefficient(X,Y,point1,point2,mean[i],mean[j]))
        covariance.append(iconvariance)

    meanImageFileName = CreateResultChartFile([x], [mean])
    covImageFileName = CreateResult3dChartFile(x, x, covariance)
    params = {'mean': {'filePath': meanImageFileName}, 'covariance': {'filePath': covImageFileName}}
    return params


H = float(sys.argv[1])
tetta = int(sys.argv[2])
NumberOfPaths = int(sys.argv[3])
ParamsT = int(sys.argv[4])
T = 1


X = []
Y = []
pathFilesJsons = []
for i in range(NumberOfPaths):
    x, y = FractionalBrownianMotion(H, tetta,T)
    X.append(x)
    Y.append(y)
    fileName = SaveResultToFileAsJSON(x, y)
    pathFilesJsons.append({'filePath': fileName})

imageFileName = CreateResultChartFile(X, Y)
imageFileJson = {'filePath': imageFileName}
params = CalculateProcessParams(X, Y, ParamsT)
print(json.dumps({'image': imageFileJson,
                  'paths': pathFilesJsons, 'params': params}))
sys.stdout.flush()