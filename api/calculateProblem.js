exports.handler = (event, context,callback) => {
    //Push all the params into a vector for easy manipulation
    let params = [];
    params.push(event.gender);
    params.push(event.age);
    params.push(event.hoursSlept);
    params.push(event.sleepPos);
    params.push(event.coffee);
    params.push(event.city);
    params.push(event.fallAsleepTime);
    params.push(event.drink);
    params.push(event.eat);
    params.push(event.screen);
    params.push(event.isolated);
    params.push(event.emotional);
    params.push(event.exercise);

    //Store the thetas as a vector - may want to use some sort of database in future
    let sleepProblemThetas = [0.036, -1.58, 0.0230, -0.0368, -0.0181, -0.0673, 0.7, 0.0468, 0.0536, 0.0807, 0.000814, -0.0290, 0.0269];
    let coffeeThetas = [0.0417, 0.672, -0.240, -0, 0.17, 3.38, 0.0256, -1.23, 0.044, 0.0369, 0.0649, -0.0403, -0.0695, -0.0286];
    let eatThetas = [-0.0432, 3.13, 0.0817, 0.0388, 0.0355, 0.101, 3.52, -0.00691, 4.42, -0.00751, 0.0139, -0.00524, 0.0658];
    let screenThetas = [0.00945, 0.661, 0.0931, 0.122, 0.0305, 0.00571, 2.95, -0.0172, 0.00578, 4.45, -0.007, 0.0424, 0.056];
    let friendsThetas = [-0.0237, 0.940, -0.0149, -0.0172, 0.0543, 0.0677, -0.7, 0.0156, 0.0358, 0.0659, 18.8, 18.1, -0.0383];

    //Let's make some predictions
    let sleepProblem = predict(dot(params, sleepProblemThetas)) > 0.5;
    console.log(sleepProblem);
    let coffeeProblem = predict(dot(params, coffeeThetas)) > 0.5;
    let eatProblem = predict(dot(params, eatThetas)) > 0.5;
    let screenProblem = predict(dot(params, screenThetas)) > 0.5;
    let friendsProblem = predict(dot(params, friendsThetas)) > 0.5;

    //And now let's get some advice
    let advice = giveAdvice(sleepProblem, coffeeProblem, eatProblem, screenProblem, friendsProblem);
    
    callback(null, advice);
};


    function giveAdvice(problem, coffee, eat, screen, friends){

        if (!problem){
            return "Your sleep is healthy";
        }

        let advice = "It seems that you have a sleep problem. I advise that you ";

        //Give advice in a numbered list
        let problemCount = 1;

        if (coffee){
            advice += problemCount + ") drink less coffee ";
            problemCount++;
        }
        if (eat){
            advice += problemCount + ") eat earlier ";
            problemCount++;
        }
        if (screen){
            advice += problemCount + ") avoid screens and anything that glows ";
            problemCount++;
        }
        if (friends){
            advice += problemCount + ") go out with friends or family ";
            problemCount++;
        }
        //No solutions for us
        if (!(coffee || eat || screen || friends))
        {
            advice += "consult this issue with your GP, as currently I don't understand this issue";
        }
    console.log(advice);
        console.log(problemCount);
        return advice;

    }

//Quick utility for tidiness of code - vector dot product
    function dot(a,b){

        let result = 0;

        if (a.length !== b.length){
            return "must be same length!";
        }
        for (let i = 0; i < a.length; i++){
            result += a[i] * b[i];
        }

        return result;

    }

//Make a prediction based upon the hypothesis formed dot(params,thetas)
    function predict (x){

        return 1/(1+Math.exp(-x));

    }


  
