async function initQuran() {
    const select = document.getElementById('surahSelect');
    if (!select) return;
    try {
        const res = await fetch('https://api.alquran.cloud/v1/surah');
        const data = await res.json();
        data.data.forEach(surah => {
            let option = document.createElement('option');
            option.value = surah.number;
            option.textContent = `${surah.number}. ${surah.name} (${surah.englishName})`;
            select.appendChild(option);
        });
    } catch (err) {
        console.error("Quran loading error:", err);
    }
}

async function loadSurah() {
    const surahNum = document.getElementById('surahSelect').value;
    const container = document.getElementById('quranContainer');
    const audioContainer = document.getElementById('audioPlayerContainer');
    const audioPlayer = document.getElementById('quranAudio');

    if (!surahNum) return;
    container.innerHTML = "<p>سورۃ لوڈ ہو رہی ہے...</p>";

    try {
        const res = await fetch(`https://api.alquran.cloud/v1/surah/${surahNum}/editions/quran-uthmani,ur.jalandhry`);
        const data = await res.json();
        const arabicAyahs = data.data[0].ayahs;
        const urduAyahs = data.data[1].ayahs;

        audioPlayer.src = `https://cdn.islamic.network/quran/audio-surah/128/ar.alafasy/${surahNum}.mp3`;
        audioContainer.style.display = "block";

        let html = '';
        arabicAyahs.forEach((ayah, index) => {
            html += `
                <div style="border-bottom: 1px solid #eee; padding: 15px 0;">
                    <p class="arabic">${ayah.text} ﴿${ayah.numberInSurah}﴾</p>
                    <p style="text-align: right; color: #444;">${urduAyahs[index].text}</p>
                </div>
            `;
        });
        container.innerHTML = html;
    } catch (err) {
        container.innerHTML = "<p>ڈیٹا لوڈ نہیں ہو سکا۔ انٹرنیٹ چیک کریں۔</p>";
    }
}

window.onload = () => {
    initQuran();
};
