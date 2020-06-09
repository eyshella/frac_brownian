import math
import random
import json
import sys
import os
import time
import gc
import matplotlib.pyplot as plt
import numpy as np
from matplotlib import cm
from scipy.integrate import quad

random.seed()


def SaveResultToFileAsJSON(x, y):
    ts = time.time()
    file_path = os.path.abspath(os.path.dirname(
        os.path.realpath(__file__))+"/FirstAlgorithm-"+str(ts)+".json")
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
        os.path.realpath(__file__))+"/FirstAlgorithm-"+str(ts)+".png")
    fig, ax = plt.subplots(dpi=600, frameon=False)
    ax.spines['top'].set_visible(False)
    ax.spines['right'].set_visible(False)
    for i in range(len(X)):
        ax.plot(X[i], Y[i], color='#f50057', linewidth=0.3)

    fig.savefig(file_path)
    return file_path


def CreateResult3dChartFile(x, y, z):
    ts = time.time()
    file_path = os.path.abspath(os.path.dirname(
        os.path.realpath(__file__))+"/FirstAlgorithm-"+str(ts)+".png")
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


def GetValueInPoint(x, y, point):
    k = 0
    while k < len(x) and x[k] < point:
        k = k+1

    if k == 0:
        return y[0]
    if k == len(x):
        return y[len(x)-1]

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
T = int(sys.argv[2])
m = int(sys.argv[3])
M = int(sys.argv[4])
NumberOfPaths = int(sys.argv[5])
ParamsT = int(sys.argv[6])

X = []
Y = []
pathFilesJsons = []
for i in range(NumberOfPaths):
    x, y = FractionalBrownianMotion(H, T, m, M)
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
