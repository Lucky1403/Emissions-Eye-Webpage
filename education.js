const links = {
    element11: { url: "https://www.footprintnetwork.org/our-work/climate-change/", title: "Climate Change Impact" },
    element12: { url: "https://css.umich.edu/publications/factsheets/sustainability-indicators/carbon-footprint-factsheet", title: "Carbon Footprint Facts" },
    element13: { url: "https://earth.org/what-does-carbon-footprint-mean/", title: "What is Carbon Footprint?" },
    element14: { url: "https://www.theguardian.com/wellness/2025/jan/30/how-reduce-environmental-footprint", title: "Reduce Environmental Footprint" },
    element21: { url: "https://www.ft.com/content/18120967-5639-41d8-8dd0-31e735648661", title: "Carbon Emissions Report" },
    element22: { url: "https://en.wikipedia.org/wiki/Individual_action_on_climate_change", title: "Climate Action Guide" },
    element23: { url: "https://news.climate.columbia.edu/2018/12/27/35-ways-reduce-carbon-footprint/", title: "35 Ways to Reduce Carbon" },
    element24: { url: "https://explore.panda.org/climate/how-to-reduce-your-carbon-footprint?utm_source=chatgpt.com", title: "WWF Climate Actions" },
    element31: { url: "https://youtu.be/5tdqNCDOCUw?si=fevac66yDnZBnvLk", title: "Climate Change Explained" },
    element32: { url: "https://youtu.be/hXrA-SEXxgc?si=OnpkaWpILMJCEE3D", title: "Carbon Footprint Basics" },
    element33: { url: "https://youtu.be/mMETVuBv02M?si=JUQk7Hw34v-EC6-X", title: "Reducing Carbon Emissions" },
    element34: { url: "https://youtu.be/qia5oBCU7bA?si=9OgHpl9zhbnZckwQ", title: "Sustainability Tips" }
};

function generateThumbnails() {
    for (let id in links) {
        let element = document.getElementById(id);
        let { url, title } = links[id];

        let imgSrc = url.includes("youtu") 
            ? `https://img.youtube.com/vi/${url.split("youtu.be/")[1].split("?")[0]}/hqdefault.jpg`
            : `https://www.google.com/s2/favicons?sz=128&domain=${new URL(url).hostname}`;

        element.innerHTML = `<a href="${url}" target="_blank" style="text-decoration: none; color: black;">
                                <center><img src="${imgSrc}" alt="Thumbnail" style="width:60%; height:auto; display:block; border-radius: 8px;"></center>
                                <h4 style="text-align:center; margin-top: 5px;">${title}</h4>
                             </a>`;
    }
}

generateThumbnails();
