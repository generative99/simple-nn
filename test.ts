import * as Assert from "https://deno.land/std@0.102.0/testing/asserts.ts";
import { NeuralNet, r, sigmoid } from "./main.ts"

Deno.test({
    name: "hello world #1",
    fn: () => {


        function mkTestVals() {
            return [Math.round(r()), Math.round(r()), Math.round(r())]
        }

        let net = new NeuralNet()

        // Train
        for (let ii = 0; ii < 1112; ii++) {

            const altNet1 = net.clone()
            altNet1.evolve()
            const altNet2 = net.clone()
            altNet2.evolve()

            const testVals = mkTestVals()
            const expectedOut = (testVals[0] + testVals[1] + testVals[2]) / testVals.length

            altNet1.run(testVals)
            altNet2.run(testVals)

            const diff1 = Math.abs(altNet1.output[0] - expectedOut)
            const diff2 = Math.abs(altNet2.output[0] - expectedOut)

            if (diff1 < diff2) {
                net = altNet1.clone()
            } else {
                net = altNet2.clone()
            }
        }

        // Test

        let totalDiff = 0
        const testsNum = 100
        for (let ii = 0; ii < testsNum; ii++) {
            const testVals = mkTestVals()
            const expectedOut = (testVals[0] + testVals[1] + testVals[2]) / testVals.length
            net.run(testVals)
            const tdiff = Math.abs(net.output[0] - expectedOut)
            totalDiff += tdiff
            // console.log('-------------')
            // console.log({ vals: testVals, net: net.output, expected: expectedOut })
        }

        console.log({ AVERAGE_DIFF: totalDiff / testsNum })

        const x = 1 + 2
        Assert.assertEquals(x, 3)
    },
});