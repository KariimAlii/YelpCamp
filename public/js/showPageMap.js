mapboxgl.accessToken = mapToken;
//=======================POPUP==========================//

const markerHeight = 60;
const markerRadius = 15;
const linearOffset = 50;
const popupOffsets = {
    top: [0, 0],
    "top-left": [0, 0],
    "top-right": [0, 0],
    bottom: [0, -markerHeight],
    "bottom-left": [
        linearOffset,
        (markerHeight - markerRadius + linearOffset) * -1,
    ],
    "bottom-right": [
        -linearOffset,
        (markerHeight - markerRadius + linearOffset) * -1,
    ],
    left: [markerRadius, (markerHeight - markerRadius) * -1],
    right: [-markerRadius, (markerHeight - markerRadius) * -1],
};
const popup = new mapboxgl.Popup({
    offset: popupOffsets,
    className: "my-class",
})
    .setHTML(`<h3>${campground.title}</h3><p>${campground.description}</p>`) 
    .setMaxWidth("300px");

/********************************************************************************************************************************************************************/
/********************************************************************************************************************************************************************/
//=======================Map 1==========================//
const map = new mapboxgl.Map({
    container: "map", // container ID
    style: "mapbox://styles/mapbox/streets-v11", // style URL
    center: campground.geometry.coordinates, // starting position [lng, lat] campground.geometry.coordinates .. [-74.5, 40]
    zoom: 9, // starting zoom
    projection: "globe", // display the map as a 3D globe
});
map.on("style.load", () => {
    map.setFog({}); // Set the default atmosphere style
});

const marker = new mapboxgl.Marker({ color: "red", scale: 1.5 })
    .setLngLat(campground.geometry.coordinates)
    .setPopup(popup)
    .addTo(map);
/********************************************************************************************************************************************************************/
/********************************************************************************************************************************************************************/
/********************************************************************************************************************************************************************/
//=======================Map 2==========================//
const map2 = new mapboxgl.Map({
    container: "map2",
    style: "mapbox://styles/mapbox/streets-v9",
    center: campground.geometry.coordinates, // starting position [lng, lat] 
    zoom: 1.5, // starting zoom
    projection: "globe", // display the map as a 3D globe
});

const size = 200;

// This implements `StyleImageInterface`
// to draw a pulsing dot icon on the map.
const pulsingDot = {
    width: size,
    height: size,
    data: new Uint8Array(size * size * 4),

    // When the layer is added to the map,
    // get the rendering context for the map canvas.
    onAdd: function () {
        const canvas = document.createElement("canvas");
        canvas.width = this.width;
        canvas.height = this.height;
        this.context = canvas.getContext("2d");
    },

    // Call once before every frame where the icon will be used.
    render: function () {
        const duration = 1000;
        const t = (performance.now() % duration) / duration;

        const radius = (size / 2) * 0.3;
        const outerRadius = (size / 2) * 0.7 * t + radius;
        const context = this.context;

        // Draw the outer circle.
        context.clearRect(0, 0, this.width, this.height);
        context.beginPath();
        context.arc(
            this.width / 2,
            this.height / 2,
            outerRadius,
            0,
            Math.PI * 2
        );
        context.fillStyle = `rgba(255, 200, 200, ${1 - t})`;
        context.fill();

        // Draw the inner circle.
        context.beginPath();
        context.arc(this.width / 2, this.height / 2, radius, 0, Math.PI * 2);
        context.fillStyle = "rgba(255, 100, 100, 1)";
        context.strokeStyle = "white";
        context.lineWidth = 2 + 4 * (1 - t);
        context.fill();
        context.stroke();

        // Update this image's data with data from the canvas.
        this.data = context.getImageData(0, 0, this.width, this.height).data;

        // Continuously repaint the map, resulting
        // in the smooth animation of the dot.
        map2.triggerRepaint();

        // Return `true` to let the map know that the image was updated.
        return true;
    },
};

map2.on("style.load", () => {
    map2.addImage("pulsing-dot", pulsingDot, { pixelRatio: 2 });

    map2.addSource("dot-point", {
        type: "geojson",
        data: {
            type: "FeatureCollection",
            features: [
                {
                    type: "Feature",
                    geometry: {
                        type: "Point",
                        coordinates: campground.geometry.coordinates, // icon position [lng, lat]   [0, 0]
                    },
                },
            ],
        },
    });
    map2.addLayer({
        id: "layer-with-pulsing-dot",
        type: "symbol",
        source: "dot-point",
        layout: {
            "icon-image": "pulsing-dot",
        },
    });
    map2.setFog({});
});
