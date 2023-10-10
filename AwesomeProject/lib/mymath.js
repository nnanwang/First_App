/* arrow function syntax */
const sq = (x) => x*x;

/* anonymous function */
const cube2 = 
    function (x) { 
        return(x*x*x);
    };


// Destructuring examples...
const power_fns = [sq,  cube2,  (r)=> sq(sq(r)), function(z){return z**5}];
const power_obj = {sq:sq, cube:cube2, fourthpower:(r) => sq(sq(r))}

function circle_area(r) {
    return (Math.PI * r * r);
}

const {cube,fourthpower} = power_obj;
  // matches sq and fourthpower keys, and assigns those values to new variables called sq and fourthpower

const x = fourthpower(5)

export {cube,power_fns,power_obj, circle_area};
export default sq;