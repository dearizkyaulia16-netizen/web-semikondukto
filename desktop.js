
document.addEventListener("DOMContentLoaded", function () {

    const main = document.querySelector(".main");
    const sidebar = document.querySelector(".sidebar");

    if (!main) return;

    // Sembunyikan sidebar lama
    if (sidebar) sidebar.style.display = "none";

    // Daftar aplikasi
    const apps = [
        { id: "home", title: "Welcome to SEMILAB", icon: "🏠" },
        { id: "upload", title: "Semiconductor Analyzer", icon: "⚛️" },
        { id: "grafik", title: "Data Graphs", icon: "📈" },
        { id: "tabel", title: "Data Table", icon: "📊" },
        { id: "learning", title: "Learning Center", icon: "📚" },
        { id: "documentation", title: "Documentation", icon: "📄" }
    ];

    // Tampilan desktop
    main.classList.add("retro-desktop");

    const desktopIcons = document.createElement("div");
    desktopIcons.className = "desktop-icons";

    const taskbar = document.createElement("div");
    taskbar.className = "retro-taskbar";

    const startButton = document.createElement("button");
    startButton.className = "start-button";
    startButton.textContent = "🪟 START";

    const taskbarApps = document.createElement("div");
    taskbarApps.className = "taskbar-apps";

    const clock = document.createElement("div");
    clock.className = "desktop-clock";

    taskbar.append(startButton, taskbarApps, clock);

    const startMenu = document.createElement("div");
    startMenu.className = "start-menu";
    startMenu.innerHTML = `
        <h3>⚛️ SEMILAB</h3>
        <p>Semiconductor Research Platform</p>
        <hr>
    `;

    main.prepend(desktopIcons);
    document.body.append(startMenu, taskbar);

    // Membuat jendela aplikasi
    apps.forEach(function (app, index) {

        const content = document.getElementById(app.id);
        if (!content) return;

        const windowBox = document.createElement("div");
        windowBox.className = "app-window";
        windowBox.id = "window-" + app.id;

        windowBox.style.left = (180 + (index % 3) * 35) + "px";
        windowBox.style.top = (45 + (index % 3) * 30) + "px";
        windowBox.style.zIndex = 10 + index;

        const titlebar = document.createElement("div");
        titlebar.className = "window-titlebar";

        titlebar.innerHTML = `
            <span>${app.icon} ${app.title}</span>
            <div class="window-controls">
                <button class="minimize">—</button>
                <button class="maximize">□</button>
                <button class="close">×</button>
            </div>
        `;

        const windowContent = document.createElement("div");
        windowContent.className = "window-content";

        windowContent.appendChild(content);
        windowBox.append(titlebar, windowContent);
        main.appendChild(windowBox);

        // Ikon desktop
        const icon = document.createElement("button");
        icon.className = "desktop-icon";
        icon.innerHTML = `<span>${app.icon}</span><small>${app.title}</small>`;

        icon.addEventListener("click", function () {
            openWindow(windowBox);
        });

        desktopIcons.appendChild(icon);

        // Tombol taskbar
        const taskButton = document.createElement("button");
        taskButton.textContent = app.icon + " " + app.title;
        taskButton.className = "taskbar-app";

        taskButton.addEventListener("click", function () {
            openWindow(windowBox);
        });

        taskbarApps.appendChild(taskButton);

        // Minimize
        titlebar.querySelector(".minimize").addEventListener("click", function () {
            windowBox.style.display = "none";
        });

        // Maximize
        titlebar.querySelector(".maximize").addEventListener("click", function () {
            windowBox.classList.toggle("maximized");
        });

        // Close
        titlebar.querySelector(".close").addEventListener("click", function () {
            windowBox.style.display = "none";
        });

        // Drag window
        let dragging = false;
        let offsetX = 0;
        let offsetY = 0;

        titlebar.addEventListener("pointerdown", function (event) {
            if (event.target.closest("button")) return;
            if (windowBox.classList.contains("maximized")) return;

            dragging = true;
            offsetX = event.clientX - windowBox.offsetLeft;
            offsetY = event.clientY - windowBox.offsetTop;

            windowBox.style.zIndex = 1000;
            titlebar.setPointerCapture(event.pointerId);
        });

        titlebar.addEventListener("pointermove", function (event) {
            if (!dragging) return;

            windowBox.style.left = (event.clientX - offsetX) + "px";
            windowBox.style.top = Math.max(0, event.clientY - offsetY) + "px";
        });

        titlebar.addEventListener("pointerup", function () {
            dragging = false;
        });

        // Menu Start
        const menuItem = document.createElement("button");
        menuItem.textContent = app.icon + " " + app.title;

        menuItem.addEventListener("click", function () {
            openWindow(windowBox);
            startMenu.classList.remove("show");
        });

        startMenu.appendChild(menuItem);

        // Hanya jendela Home yang dibuka pertama kali
        if (app.id !== "home") {
            windowBox.style.display = "none";
        }
    });

    function openWindow(windowBox) {
        windowBox.style.display = "flex";
        windowBox.classList.remove("maximized");
        windowBox.style.zIndex = 1000;
    }

    startButton.addEventListener("click", function () {
        startMenu.classList.toggle("show");
    });

    function updateClock() {
        clock.textContent = new Date().toLocaleTimeString("id-ID", {
            hour: "2-digit",
            minute: "2-digit"
        });
    }

    updateClock();
    setInterval(updateClock, 1000);

});
