import React from 'react';

export default ({cx,cy,r, color, node}) => {
  const pi_six = Math.PI/6;
	const cos_six = Math.cos(pi_six);
	const sin_six = Math.sin(pi_six);
  let hexPoints = [
		    [0, 0 - r].join(","),
		    [0 + cos_six * r, 0 - sin_six * r].join(","),
		    [0 + cos_six * r, 0 + sin_six * r].join(","),
		    [0, 0 + r].join(","),
		    [0 - cos_six * r, 0 + sin_six * r].join(","),
		    [0 - cos_six * r, 0 - sin_six * r].join(",")
		  ].join(" ");
  return (
    <g transform={`translate(${cx},${cy})`}>
      <polygon points={hexPoints} style={{fill: color}}/>
      <text>{node.region} ({node.teams})</text>
    </g>
  )
}
