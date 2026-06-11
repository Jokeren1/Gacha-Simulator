declare const confetti: any;

type Rarity = "common" | "uncommon" | "rare" | "epic" | "legendary";

interface GachaCharacter {
    name: string;
    image: string;
    weight: number;
    rarity: Rarity;
    quote: string;
}

const gambleButton = document.getElementById("summon")! as HTMLButtonElement;
const resetButton = document.getElementById("reset")! as HTMLButtonElement;
const pullCount = document.getElementById("pullCount")! as HTMLParagraphElement;
const result = document.getElementById("result")! as HTMLParagraphElement;
const characterImage = document.getElementById("characterImage")! as HTMLImageElement;
const rarityTracker = document.getElementById("rarityTracker")! as HTMLParagraphElement;
const characterTracker = document.getElementById("characterTracker")! as HTMLUListElement;
const characterCounts: Record<string, number> = {};

const gachaPool: GachaCharacter[] = [
    { name: "Surprised Faust", image: "faust.png", weight: 19.98, rarity: "common", quote: "D:"},
    { name: "Disappointed Faust", image: "lockin.jpg", weight: 19.98, rarity: "common", quote: "Lock in manager."},
    { name: "Cursed Faust", image: "DonFaust.png", weight: 19.98, rarity: "common", quote: "관리자... 나리!!!!"},
    { name: "Sad Faust", image: "DonFaustSad.png", weight: 19.98, rarity: "common", quote: "아니ㅣㅣㅣ!!! 왜 내 봿지를 빼는것이요??"},
    { name: "Don Quixote", image: "DON.png", weight: 1.6, rarity: "rare", quote: "Beach volleybrll"},
    { name: "Butter Lei Heng", image: "lei.png", weight: 7.99, rarity: "uncommon", quote: "Butter my biscuit"},
    { name: "Lei Heng", image: "Lei_Heng.png", weight: 7.99, rarity: "uncommon", quote: "Hwat in tarnation?"},
    { name: "Angry Xichun", image: "xichun.png", weight: 0.32, rarity: "epic", quote: "RAHHHHH"},
    { name: "Happy Xichun", image: "jia.gif", weight: 0.26, rarity: "legendary", quote: "Happy happy happy"},
    { name: "Firefist Gregor", image: "FireGregor.jpg", weight: 1.6, rarity: "rare", quote: "Insert screaming sound"},
    { name: "Sinnerling 12 Gregor", image: "BabyGregor.png", weight: 0.32, rarity: "epic", quote: "WAHHHHHH"}
];

const rarityCounts: Record<Rarity, number> = {
    common: 0,
    uncommon: 0,
    rare: 0,
    epic: 0,
    legendary: 0
};

const rarityOrder: Record<Rarity, number> = {
    common: 0, // common will be at the top (visually wise)
    uncommon: 1,
    rare: 2,
    epic: 3,
    legendary: 4 // legendary will be at the bottom
};

const sortedCharacters = [...gachaPool].sort((a, b) => rarityOrder[a.rarity] - rarityOrder[b.rarity]);

let gambleCount = 0;

gambleButton.addEventListener("click", summon);
resetButton.addEventListener("click", resetGame);

function rollGacha(): GachaCharacter {
    const totalWeight = gachaPool.reduce((sum, char) => sum + char.weight, 0);
    let roll = Math.random() * totalWeight;

    for (const char of gachaPool) {
        roll -= char.weight;
        if (roll < 0) {
            return char;
        }
    }
    // Fallback just in case
    return gachaPool[gachaPool.length - 1]!;
}

function showResult(char: GachaCharacter): void {
    const rarityLabel = char.rarity.charAt(0).toUpperCase() + char.rarity.slice(1);
    result.textContent = `You got ${char.name}! (${rarityLabel})\n"${char.quote}"`;
    result.className = `rarity-${char.rarity}`;
}

function showcharacter(char: GachaCharacter): void {
    characterImage.src = char.image;
    characterImage.hidden = false;
}

function updateTrackers(char: GachaCharacter): void {
    characterCounts[char.name] = (characterCounts[char.name] ?? 0) + 1;
    rarityCounts[char.rarity] += 1;

    rarityTracker.textContent = 
        `Common: ${rarityCounts.common} | Uncommon: ${rarityCounts.uncommon} | Rare: ${rarityCounts.rare} | Epic: ${rarityCounts.epic} | Legendary: ${rarityCounts.legendary}`;

    characterTracker.innerHTML = "";

    let currentRarity: Rarity | null = null;

    for (const char of sortedCharacters) {
        const count = characterCounts[char.name] ?? 0;

        if (count === 0) { continue; }

        if (char.rarity !== currentRarity) {
            currentRarity = char.rarity; 

            const heading = document.createElement("h3");
            heading.textContent = currentRarity.toUpperCase();
            characterTracker.appendChild(heading);
        }

        const item = document.createElement("li");
        item.textContent = `${char.name}: ${count}`;
        characterTracker.appendChild(item);
    }

}

function resetGame(): void { 
    console.log("reset please :C");
    gambleCount = 0;
    pullCount.textContent = "Pull Count: 0";

    result.textContent = "Press the button to summon!";
    result.className = "";

    characterImage.hidden = true;
    characterImage.src = "";

    for (const name in characterCounts) {
        characterCounts[name] = 0;
    }

    rarityCounts.common = 0;
    rarityCounts.uncommon = 0;
    rarityCounts.rare = 0;
    rarityCounts.epic = 0;
    rarityCounts.legendary = 0;

    rarityTracker.textContent = "Common: 0 | Uncommon: 0 | Rare: 0 | Epic: 0 | Legendary: 0";
    characterTracker.innerHTML = "";
}

function summon(): void {
    gambleCount += 1;
    pullCount.textContent = `Pull Count: ${gambleCount}`;

    const won = rollGacha();
    
    showResult(won);
    showcharacter(won);
    updateTrackers(won);
    confettiYay(won.rarity);
}

function confettiYay(rarity: Rarity): void {
    const count = rarity === "legendary" ? 400 : rarity === "epic" ? 300 : 200;
    const defaults = { origin: { y: 0.7 } };

    function fire(particleRatio: number, opts: Record<string, unknown>): void {
        confetti(
            Object.assign({}, defaults, opts, {
                particleCount: Math.floor(count * particleRatio),
            })
        );
    }

    fire(0.25, { spread: 26, startVelocity: 55 });
    fire(0.2, { spread: 60 });
    fire(0.35, { spread: 100, decay: 0.91, scalar: 0.8 });
    fire(0.1, { spread: 120, startVelocity: 25, decay: 0.92, scalar: 1.2 });
    fire(0.1, { spread: 120, startVelocity: 45 });

    if (rarity === "legendary") {
        fire(0.3, { spread: 160, startVelocity: 60, colors: ["#f59e0b", "#fbbf24", "#fde68a"] });
    }
}