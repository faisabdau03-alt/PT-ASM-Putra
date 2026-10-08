/* =========================================================
   FAISAL ABDAU - 16-BIT RETRO PORTFOLIO
   SCRIPT.JS (Web Audio API Synthesizer & Retro Interactions)
   ========================================================= */

(function () {
    "use strict";

    /* =========================================================
       1. WEB AUDIO API - 8/16-BIT SOUND SYNTHESIZER
       ========================================================= */
    let audioCtx = null;
    let sfxEnabled = true;

    function getAudioContext() {
        if (!audioCtx) {
            const AudioContextClass = window.AudioContext || window.webkitAudioContext;
            if (AudioContextClass) {
                audioCtx = new AudioContextClass();
            }
        }
        if (audioCtx && audioCtx.state === "suspended") {
            audioCtx.resume();
        }
        return audioCtx;
    }

    // Play a single retro tone
    function playTone(freq, type, duration, startTime = 0, gainLevel = 0.1) {
        if (!sfxEnabled) return;
        const ctx = getAudioContext();
        if (!ctx) return;

        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = type; // 'square', 'sawtooth', 'triangle'
        osc.frequency.setValueAtTime(freq, ctx.currentTime + startTime);

        gain.gain.setValueAtTime(gainLevel, ctx.currentTime + startTime);
        gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + startTime + duration);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(ctx.currentTime + startTime);
        osc.stop(ctx.currentTime + startTime + duration);
    }

    // Sound: Blip / Nav Hover / Click
    function sfxBlip() {
        playTone(440, "square", 0.06, 0, 0.08);
    }

    // Sound: Menu Select / Push
    function sfxSelect() {
        if (!sfxEnabled) return;
        const ctx = getAudioContext();
        if (!ctx) return;
        playTone(280, "square", 0.08, 0, 0.1);
        playTone(420, "square", 0.08, 0.05, 0.1);
    }

    // Sound: Classic Coin Chime (B5 -> E6)
    function sfxCoin() {
        if (!sfxEnabled) return;
        const ctx = getAudioContext();
        if (!ctx) return;
        playTone(987.77, "square", 0.08, 0, 0.12);
        playTone(1318.51, "square", 0.28, 0.08, 0.12);
    }

    // Sound: 1UP / Power Up Arpeggio
    function sfxPowerUp() {
        if (!sfxEnabled) return;
        const notes = [330, 392, 659, 523, 587, 784];
        notes.forEach((freq, i) => {
            playTone(freq, "square", 0.1, i * 0.06, 0.1);
        });
    }

    // Sound: Laser Pew
    function sfxLaser() {
        if (!sfxEnabled) return;
        const ctx = getAudioContext();
        if (!ctx) return;

        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = "sawtooth";
        osc.frequency.setValueAtTime(880, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(110, ctx.currentTime + 0.15);

        gain.gain.setValueAtTime(0.12, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.15);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start();
        osc.stop(ctx.currentTime + 0.16);
    }

    // Sound: Fanfare Win / Level Clear
    function sfxFanfare() {
        if (!sfxEnabled) return;
        const melody = [
            { f: 523.25, d: 0.1, t: 0 },
            { f: 659.25, d: 0.1, t: 0.1 },
            { f: 783.99, d: 0.1, t: 0.2 },
            { f: 1046.50, d: 0.35, t: 0.3 }
        ];
        melody.forEach(item => {
            playTone(item.f, "square", item.d, item.t, 0.12);
        });
    }

    // Sound Mapping
    const sfxMap = {
        blip: sfxBlip,
        select: sfxSelect,
        coin: sfxCoin,
        powerup: sfxPowerUp,
        laser: sfxLaser,
        fanfare: sfxFanfare
    };

    function playSfxByName(name) {
        if (sfxMap[name]) {
            sfxMap[name]();
        } else {
            sfxSelect();
        }
    }


    /* =========================================================
       2. HUD BUTTONS & TOGGLES (SFX, CRT, COINS)
       ========================================================= */
    const sfxToggle = document.getElementById("sfxToggle");
    const sfxIcon = document.getElementById("sfxIcon");
    const crtToggle = document.getElementById("crtToggle");
    const crtIcon = document.getElementById("crtIcon");
    const coinBtn = document.getElementById("coinBtn");
    const coinCountEl = document.getElementById("coinCount");
    const scoreValEl = document.getElementById("scoreVal");

    let coins = 99;
    let score = 82026;

    // Toggle Sound
    if (sfxToggle) {
        sfxToggle.addEventListener("click", function () {
            sfxEnabled = !sfxEnabled;
            sfxIcon.textContent = sfxEnabled ? "🔊" : "🔇";
            if (sfxEnabled) sfxCoin();
        });
    }

    // Toggle CRT Scanlines
    if (crtToggle) {
        crtToggle.addEventListener("click", function () {
            document.body.classList.toggle("crt-enabled");
            const isEnabled = document.body.classList.contains("crt-enabled");
            crtIcon.textContent = isEnabled ? "📺" : "🖥️";
            sfxSelect();
        });
    }

    // Click Coin
    if (coinBtn) {
        coinBtn.addEventListener("click", function () {
            coins++;
            score += 100;
            coinCountEl.textContent = `x${coins}`;
            scoreValEl.textContent = String(score).padStart(6, "0");
            sfxCoin();

            // Flash effect
            coinBtn.style.transform = "scale(1.2)";
            setTimeout(() => {
                coinBtn.style.transform = "scale(1)";
            }, 120);
        });
    }


    /* =========================================================
       3. PLAYSTATION CONTROLLER BUTTONS (△ ○ ✕ □)
       ========================================================= */
    const psComboButtons = document.querySelectorAll(".ps-btn-pad");
    const comboMsg = document.getElementById("comboMsg");

    const psQuotes = {
        TRI: {
            msg: "▲ SPECIAL: RESPONSIVE FLEXBOX STRIKE!",
            sfx: "laser"
        },
        CIR: {
            msg: "● DEFENSE: CLEAN SEMANTIC HTML SHIELD!",
            sfx: "powerup"
        },
        CRO: {
            msg: "✖ ACTION: HIGH-SPEED JS COMBO HIT!",
            sfx: "coin"
        },
        SQU: {
            msg: "■ CHARGE: 16-BIT RETRO RETRO POWER!",
            sfx: "fanfare"
        }
    };

    psComboButtons.forEach(btn => {
        btn.addEventListener("click", function () {
            const comboType = this.getAttribute("data-combo");
            if (psQuotes[comboType]) {
                comboMsg.textContent = psQuotes[comboType].msg;
                comboMsg.style.color = "var(--neon-green)";
                playSfxByName(psQuotes[comboType].sfx);

                setTimeout(() => {
                    comboMsg.style.color = "var(--neon-gold)";
                }, 400);
            }
        });
    });


    /* =========================================================
       4. BUFF SPELL BUTTON
       ========================================================= */
    const buffBtn = document.getElementById("buffBtn");
    const buffNotice = document.getElementById("buffNotice");

    if (buffBtn) {
        buffBtn.addEventListener("click", function () {
            sfxPowerUp();
            buffNotice.textContent = "⚡ +20% BOOST ACTIVE!";
            buffNotice.style.color = "var(--neon-cyan)";

            // Temporarily animate stat bars
            const bars = document.querySelectorAll(".bar-fill");
            bars.forEach(bar => {
                bar.style.filter = "brightness(1.4) drop-shadow(0 0 6px #fff)";
            });

            setTimeout(() => {
                bars.forEach(bar => {
                    bar.style.filter = "none";
                });
                buffNotice.textContent = "COOLDOWN... READY!";
                buffNotice.style.color = "var(--neon-green)";
            }, 3000);
        });
    }


    /* =========================================================
       5. SOUNDBOARD PILLS IN PS ZONE
       ========================================================= */
    const soundPills = document.querySelectorAll("[data-sound]");
    soundPills.forEach(pill => {
        pill.addEventListener("click", function () {
            const soundType = this.getAttribute("data-sound");
            playSfxByName(soundType);
        });
    });


    /* =========================================================
       6. GLOBAL CLICK SOUNDS ON DATA-SFX
       ========================================================= */
    document.addEventListener("click", function (e) {
        const target = e.target.closest("[data-sfx]");
        if (target) {
            const sfxType = target.getAttribute("data-sfx");
            playSfxByName(sfxType);
        }
    });


    /* =========================================================
       7. ACTIVE NAVIGATION SPY
       ========================================================= */
    const navLinks = document.querySelectorAll(".hud-nav .hud-link");
    const sections = document.querySelectorAll("section[id]");

    window.addEventListener("scroll", function () {
        let currentSection = "";
        const scrollY = window.pageYOffset;

        sections.forEach(section => {
            const sectionTop = section.offsetTop - 120;
            const sectionHeight = section.offsetHeight;
            if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
                currentSection = section.getAttribute("id");
            }
        });

        navLinks.forEach(link => {
            link.classList.remove("active");
            if (link.getAttribute("href") === `#${currentSection}`) {
                link.classList.add("active");
            }
        });
    });


    /* =========================================================
       8. EASTER EGG: KONAMI CODE (↑ ↑ ↓ ↓ ← → ← → B A)
       ========================================================= */
    const konamiSequence = [
        "ArrowUp", "ArrowUp",
        "ArrowDown", "ArrowDown",
        "ArrowLeft", "ArrowRight",
        "ArrowLeft", "ArrowRight",
        "KeyB", "KeyA"
    ];
    let konamiIndex = 0;

    const secretModal = document.getElementById("secretModal");
    const secretClose = document.getElementById("secretClose");
    const secretOkBtn = document.getElementById("secretOkBtn");

    function closeSecretModal() {
        if (secretModal) {
            secretModal.classList.remove("active");
            sfxSelect();
        }
    }

    if (secretClose) secretClose.addEventListener("click", closeSecretModal);
    if (secretOkBtn) secretOkBtn.addEventListener("click", closeSecretModal);

    window.addEventListener("keydown", function (e) {
        const requiredKey = konamiSequence[konamiIndex];

        if (e.code === requiredKey || e.key.toLowerCase() === requiredKey.toLowerCase()) {
            konamiIndex++;
            sfxBlip();

            if (konamiIndex === konamiSequence.length) {
                // KONAMI CODE TRIGGERED!
                konamiIndex = 0;
                sfxFanfare();
                score = 999999;
                if (scoreValEl) scoreValEl.textContent = "999999";
                if (secretModal) secretModal.classList.add("active");
            }
        } else {
            konamiIndex = 0;
        }
    });

    console.log("%c[16-BIT RETRO PORTFOLIO LOADED]", "color: #00f0ff; font-weight: bold; font-size: 14px;");
    console.log("%cFAISAL ABDAU • FRONTEND WARRIOR & PS GAMER", "color: #ffcc00; font-size: 12px;");
})();
