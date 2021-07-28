export class NeuralNet {

    layers: INeuron[][] = []
    output: number[] = []
    biases: number[] = []

    constructor() {

        const numLayers = 7 // Total layers (including input/output)
        const numNeurons = 4 // Neurons per layer (uniform)
        const numConnections = 4 // connections per neuron (manually set to be fully connected)

        for (let ii = 0; ii < numLayers; ii++) {
            this.biases[ii] = rn()
        }

        for (let ii = 0; ii < numLayers; ii++) {
            const layer: INeuron[] = []
            this.layers.push(layer)
            for (let yy = 0; yy < numNeurons; yy++) {
                const neuron: INeuron = {
                    biasWeight: rn(),
                    layer: ii,
                    acum: 0,
                    connections: []
                }

                layer.push(neuron)
                for (let xx = 0; xx < numConnections; xx++) {
                    const connection: IConnection = {
                        weight: rn(),
                        neuronTarget: Math.floor(r() * numNeurons)
                    }

                    neuron.connections.push(connection)
                }
            }
        }
    }

    activate(val: number) {
        return sigmoid(val)
    }

    run(vals: number[]) {

        this.clear()
        for (let ii = 0; ii < this.layers[0].length; ii++) {
            const neuron = this.layers[0][ii]

            if (vals[ii] !== undefined) {
                neuron.acum = vals[ii]
            }
        }

        for (let ii = 0; ii < this.layers.length; ii++) {
            const layer = this.layers[ii]
            for (let yy = 0; yy < layer.length; yy++) {
                const neuron = layer[yy]
                // console.log(neuron.acum)
                let activatedVal = 1
                if (ii === 0) { // input
                    neuron.acum += this.biases[ii]
                    activatedVal = neuron.acum
                } else if (ii === (this.layers.length - 1)) { // output
                    activatedVal = neuron.acum
                } else {
                    neuron.acum += this.biases[ii]
                    activatedVal = neuron.acum
                    // activatedVal = this.activate(neuron.acum)
                }

                // if (ii === 4) {
                //     console.log(activatedVal)
                // }
                if (ii <= this.layers.length - 2) {
                    for (let xx = 0; xx < neuron.connections.length; xx++) {
                        const connection = neuron.connections[xx]
                        const targetNeuron = this.layers[ii + 1][connection.neuronTarget]
                        targetNeuron.acum += (activatedVal * connection.weight)
                    }
                } else {
                    this.output[yy] = activatedVal
                }
            }
        }

    }

    clear() {
        // this.output = []
        for (let ii = 0; ii < this.layers.length; ii++) {
            const layer = this.layers[ii]
            for (let yy = 0; yy < layer.length; yy++) {
                const neuron = layer[yy]
                neuron.acum = 0
            }
        }
    }

    evolve() {
        for (let ii = 0; ii < this.layers.length; ii++) {
            const layer = this.layers[ii]
            for (let yy = 0; yy < layer.length; yy++) {

                if (r() > .91) { // chance to mutate

                    const neuron = layer[yy]

                    for (let xx = 0; xx < neuron.connections.length; xx++) {
                        const connection = neuron.connections[xx]
                        connection.weight += negNorm(sigmoid(rn() * .8))
                        // console.log(negNorm(sigmoid(rn() * .8)))
                    }
                }
            }
        }

        return this
    }

    clone(): NeuralNet {
        const net = new NeuralNet()
        net.layers = JSON.parse(JSON.stringify(this.layers))
        return net
    }
}

export function sigmoid(z: number) {
    return 1 / (1 + Math.exp(-z))
}

export function r() {
    return Math.random()
}

function rn() {
    return negNorm(Math.random())
}
function negNorm(num: number) {
    return 2 * (num - .5)
}

interface IConnection {
    neuronTarget: number
    weight: number
}

interface INeuron {
    biasWeight: number
    layer: number
    acum: number
    connections: IConnection[]
}