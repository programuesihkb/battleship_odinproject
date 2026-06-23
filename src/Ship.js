
export default function Ship(length){
    let hits = 0;

    function hit(){
        hits++;
    }

    function isSunk(){
        return hits >= length;
    }

    function getHits(){
        return hits;
    }

    function getLength(){
        return length;
    }

    return {
        hit,
        isSunk,
        getHits,
        getLength
    };
}