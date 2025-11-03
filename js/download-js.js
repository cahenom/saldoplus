const axios = require("axios");
const cheerio = require("cheerio");
const fs = require("fs");
const path = require("path");

const baseURL = "https://kedaikampung.id/js/"; // folder JS
const downloadFolder = path.join(__dirname, "js");

// buat folder jika belum ada
if (!fs.existsSync(downloadFolder)) {
    fs.mkdirSync(downloadFolder);
}

(async () => {
    try {
        // Ambil HTML folder
        const { data } = await axios.get(baseURL);
        const $ = cheerio.load(data);

        // ambil semua link .js
        const links = [];
        $("a").each((i, el) => {
            const href = $(el).attr("href");
            if (href && href.endsWith(".js")) {
                links.push(href);
            }
        });

        // download semua file JS
        for (const link of links) {
            const url = new URL(link, baseURL).href; // gabung baseURL + relative path
            const filename = path.join(downloadFolder, path.basename(link));

            const response = await axios.get(url, { responseType: "arraybuffer" });
            fs.writeFileSync(filename, response.data);
            console.log("Downloaded", filename);
        }

        console.log("Semua file JS berhasil di-download!");
    } catch (err) {
        console.error(err);
    }
})();
