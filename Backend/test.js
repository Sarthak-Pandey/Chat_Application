import stackoverflow from './src/services/stackoverFlow.service.js'

async function test(){
    const result = await stackoverflow.searchQuestion("how to use fetch api");
    console.log(result);
}

test();