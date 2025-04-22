
import React, { useState } from 'react';
import ReactDOM from 'react-dom/client';

type Racer = {
    name: string;
    car?: number;
}
const racer1: Racer = {
    name: "Tom"
};
const racer2: Racer = {
    name: "McQueen"
};
const racer3: Racer = {
    name: "Harry"
};
const racer4: Racer = {
    name: "Trevor"
};
const racer5: Racer = {
    name: "Michael"
};
const racer6: Racer = {
    name: "Lila"
};

const RacerList: Racer[] = [racer1, racer2, racer3, racer4, racer5, racer6];




export default RacerList;