import React, { Component } from 'react';
import * as force from 'd3-force';
import * as scale from 'd3-scale';
import * as geo from 'd3-geo';
import Hex from './Hex';
import Data from './retention';
import Country from './Country';
import Abbr from './AbbrLookup';

export default class App extends Component {
  render() {

    const MIN_RAD = 25
    const MAX_RAD = 100
    let regions = Data.filter((d) => d.year == 2015 && d.region != "ALL" && d.teams > 0)
    let popScale = scale.scalePow().domain([0, 450]).range([MIN_RAD, MAX_RAD])
    //  popScale = () => 25
    let retentionScale = scale.scaleLinear().domain([70,100]).range([0.0,1.0])
    let proj = geo.geoAlbersUsa()
    let centroids = {};
    Country.features.map((f) => {
      centroids[f.properties.NAME]= proj(geo.geoCentroid(f.geometry));
    })

    let retScale = (t) => scale.interpolateViridis(retentionScale(t));
    regions = regions.map((state,i) => {
      const centroid = centroids[Abbr[state.region]]||[0,0];

      return {id: i, x: centroid[0], y: centroid[1], radius: popScale(state.teams), color: retScale(state.pct_retained), ...state};
    })

    let indexLookup = {};
    regions.map((state, i) => {
      indexLookup[state.region] = i;
    })

    let collider = force.forceCollide((n) => n.radius*.98)
      .iterations(5)
    let attractor = force.forceManyBody().strength(10);
    let sim = force.forceSimulation(regions)
      .force("collide", collider)
      .force("attract", attractor)
      .stop()
      // Run the force algorithm for a bit
      for (var i = 0; i < 300; i++) {
        sim.tick()
      }


    return (
      <svg width="80%" height="80%" viewBox="0 0 1000 1000">
          <g transform="translate(0,0)">
            {regions.map((n) =>
              // <Motion  key={n.id} defaultStyle={{x:500, y:500}} style={{x: spring(n.x, presets.stiff), y: spring(n.y, presets.stiff)}}>
              //   { inter =>
                  <Hex key={n.id} cx={n.x} cy={n.y} r={n.radius*.98} color={n.color} node={n}/>
              //   }
              // </Motion>
            )}

          </g>
      </svg>
    );
  }
}
