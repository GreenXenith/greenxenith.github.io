document.addEventListener("click", e => {
    if (e.target.id == "email") {
        // Obfuscated email
        location.href = atob("bWFpbHRvOg==") + atob("Z3JlZW54ZW5pdGhA") + atob("Z21haWwuY29t");
    }
});

window.addEventListener("load", () => {
    const container = document.getElementById("hero");
    const canvas = document.getElementById("hero-canvas");
    const ctx = canvas.getContext("2d");

    let previous_step = (new Date).getTime();
    let drops = [];
    let ripples = [];
    let last_move = 0;

    const drop_velocity = [-1, 12];
    const drop_length = 0.2;
    const drop_width = 0.5;
    const drop_from = -6;
    const drops_per_second = 20;
    const drop_target_variation = 0.5;

    const ripple_speed = 0.8;
    const ripple_distance = 0.6;
    const ripple_angle = 0.5;

    const canvas_height_meters = 3;
    const canvas_y0 = 0.85;

    const sky_color = "#012230";
    const drop_color = "#eeeeee";
    const drop_opacity = 0.2;

    function update() {
        canvas.width = container.clientWidth, canvas.height = container.clientHeight;

        const now = new Date;
        const dtime = (now.getTime() - previous_step) / 1000;
        previous_step = now;

        const meter = canvas.height / canvas_height_meters;

        if (Math.random() <= drops_per_second * dtime) {
            drops.push([
                Math.random() * (canvas.width / meter + 2) - 1,
                drop_from,
                (Math.random() - 0.5) * (drop_target_variation * 2), // Drop to
                drop_length
            ]);
        }

        for (const idx in drops) {
            const drop = drops[idx];

            drop[1] += drop_velocity[1] * dtime;

            if (drop[1] >= drop[2]) {
                drop[1] = drop[2];

                if (drop[3] == drop_length) ripples.push([drop[0], drop[1], 0]);
                drop[3] -= dtime * Math.sqrt(drop_velocity[0] ** 2, drop_velocity[1] ** 2);
            } else {
                drop[0] += drop_velocity[0] * dtime;
            }

            if (drop[3] <= 0) drops.shift();
        }

        for (const idx in ripples) {
            const ripple = ripples[idx];
            ripple[2] += ripple_speed * dtime;

            if (ripple[2] > ripple_distance) ripples.shift();
        }

        last_move -= dtime;

        draw();
        window.requestAnimationFrame(update);
    }

    function addRippleAt(x, y) {
        const meter = canvas.height / canvas_height_meters;
        const y0 = canvas_y0 * canvas.height;

        const rx = x / meter;
        const ry = (y - y0) / meter;
        if (ry <= drop_target_variation && ry >= -drop_target_variation) {
            ripples.push([rx, ry, 0]);
        }
    }

    container.addEventListener("mousemove", e => {
        if (last_move > 0) return;
        last_move = 0.1;

        addRippleAt(e.offsetX, e.offsetY);
    });

    container.addEventListener("click", e => addRippleAt(e.offsetX, e.offsetY));

    function draw() {
        const w = canvas.width, h = canvas.height;
        const meter = canvas.height / canvas_height_meters;
        const y0 = canvas_y0 * canvas.height;

        ctx.fillStyle = sky_color;
        ctx.fillRect(0, 0, w, h);

        ctx.strokeStyle = drop_color + Math.ceil(drop_opacity * 255).toString(16).padStart(2, "0");
        ctx.lineWidth = drop_width;
        ctx.lineCap = "round";

        for (const drop of drops) {
            ctx.beginPath();
            ctx.moveTo(drop[0] * meter, drop[1] * meter + y0);
            ctx.lineTo(
                (drop[0] - drop_velocity[0] * drop[3]) * meter,
                (drop[1] - drop_velocity[1] * drop[3]) * meter + y0
            )
            ctx.stroke();
        }

        ctx.lineWidth = 1;

        for (const ripple of ripples) {
            const opacity = (1 - (ripple[2] / ripple_distance)) * drop_opacity;
            ctx.strokeStyle = drop_color + Math.max(0, Math.floor(opacity * 255)).toString(16).padStart(2, "0");

            ctx.beginPath();
            ctx.ellipse(ripple[0] * meter, ripple[1] * meter + y0, ripple[2] * meter, ripple[2] * meter * ripple_angle, 0, 0, Math.PI * 2);
            ctx.stroke();
        }
    }

    window.requestAnimationFrame(update);
});

window.addEventListener("load", () => {
    const overlay = document.getElementById("view-overlay");
    const img = document.getElementById("full-image");

    document.addEventListener("click", e => {
        if (e.target.className == "image-thumb") {
            img.src = e.target.getAttribute("full-src");
            overlay.style.visibility = "visible";
            overlay.style.opacity = 1;
        } else if (e.target.className == "close-overlay") {
            overlay.style.visibility = "hidden";
            overlay.style.opacity = 0;
            img.src = "";
        }
    });
});
