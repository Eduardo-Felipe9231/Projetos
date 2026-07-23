/* =========================
   DADOS INICIAIS
========================= */

const employees = [
    {
        id: 1,
        name: "Fabiane",
        department: "SE",
        color: "#ec4899"
    },

    {
        id: 2,
        name: "Ana Beatriz",
        department: "SE",
        color: "#3b82f6"
    },

    {
        id: 3,
        name: "Ítalo",
        department: "SE",
        color: "#ef4444"
    },

    {
        id: 4,
        name: "Eduardo",
        department: "SE",
        color: "#22c55e"
    }
];


let vacations =
    JSON.parse(
        localStorage.getItem("vacationsSE")
    ) || [];


let editingVacationId = null;


let currentCalendarDate =
    new Date();



/* =========================
   INICIALIZAÇÃO
========================= */

document.addEventListener(
    "DOMContentLoaded",
    () => {

        initializeNavigation();

        populateEmployeeSelect();

        updateCurrentDate();

        updateDashboard();

        renderEmployees();

        renderVacationsTable();

        renderCalendar();

    }
);



/* =========================
   NAVEGAÇÃO
========================= */

function initializeNavigation() {

    const menuItems =
        document.querySelectorAll(
            ".menu-item"
        );


    const pages =
        document.querySelectorAll(
            ".page"
        );


    menuItems.forEach(
        item => {

            item.addEventListener(
                "click",
                () => {

                    const page =
                        item.dataset.page;


                    menuItems.forEach(
                        i =>
                            i.classList.remove(
                                "active"
                            )
                    );


                    item.classList.add(
                        "active"
                    );


                    pages.forEach(
                        p =>
                            p.classList.remove(
                                "active-page"
                            )
                    );


                    document
                        .getElementById(page)
                        .classList.add(
                            "active-page"
                        );


                    updatePageTitle(
                        page
                    );

                }
            );

        }
    );


    document
        .getElementById(
            "mobileMenu"
        )
        .addEventListener(
            "click",
            () => {

                document
                    .getElementById(
                        "sidebar"
                    )
                    .classList.toggle(
                        "open"
                    );

            }
        );

}



/* =========================
   TÍTULOS
========================= */

function updatePageTitle(
    page
) {

    const titles = {

        dashboard: [
            "Dashboard",
            "Visão geral das férias do setor"
        ],

        calendario: [
            "Calendário",
            "Visualização das férias por período"
        ],

        funcionarios: [
            "Funcionários",
            "Equipe do setor SE"
        ],

        ferias: [
            "Controle de férias",
            "Todos os períodos cadastrados"
        ]

    };


    const data =
        titles[page];


    document
        .getElementById(
            "pageTitle"
        )
        .textContent =
        data[0];


    document
        .getElementById(
            "pageSubtitle"
        )
        .textContent =
        data[1];

}



/* =========================
   DATA ATUAL
========================= */

function updateCurrentDate() {

    const today =
        new Date();


    document
        .getElementById(
            "currentDate"
        )
        .textContent =

        today.toLocaleDateString(
            "pt-BR",
            {
                weekday: "long",
                day: "numeric",
                month: "long",
                year: "numeric"
            }
        );

}



/* =========================
   STATUS
========================= */

function getVacationStatus(
    vacation
) {

    const today =
        new Date();


    today.setHours(
        0,
        0,
        0,
        0
    );


    const start =
        new Date(
            vacation.start + "T00:00:00"
        );


    const end =
        new Date(
            vacation.end + "T00:00:00"
        );


    if (
        today >= start &&
        today <= end
    ) {

        return "Em férias";

    }


    if (
        start > today
    ) {

        return "Programada";

    }


    return "Concluída";

}



/* =========================
   CONTAGEM DE DIAS
========================= */

function calculateDays(
    start,
    end
) {

    const startDate =
        new Date(
            start + "T00:00:00"
        );


    const endDate =
        new Date(
            end + "T00:00:00"
        );


    const difference =
        endDate -
        startDate;


    return Math.floor(
        difference /
        (1000 * 60 * 60 * 24)
    ) + 1;

}



/* =========================
   CONTAGEM REGRESSIVA
========================= */

function daysUntil(
    date
) {

    const today =
        new Date();


    today.setHours(
        0,
        0,
        0,
        0
    );


    const target =
        new Date(
            date + "T00:00:00"
        );


    const difference =
        target -
        today;


    return Math.ceil(
        difference /
        (1000 * 60 * 60 * 24)
    );

}



/* =========================
   DASHBOARD
========================= */

function updateDashboard() {

    const statuses =
        vacations.map(
            getVacationStatus
        );


    let working =
        employees.length;


    let scheduled =
        0;


    let onVacation =
        0;


    employees.forEach(
        employee => {

            const employeeVacations =
                vacations.filter(
                    v =>
                        v.employeeId ===
                        employee.id
                );


            const active =
                employeeVacations.find(
                    v =>
                        getVacationStatus(
                            v
                        ) ===
                        "Em férias"
                );


            const upcoming =
                employeeVacations.find(
                    v =>
                        getVacationStatus(
                            v
                        ) ===
                        "Programada"
                );


            if (active) {

                onVacation++;

                working--;

            }

            else if (upcoming) {

                scheduled++;

            }

        }
    );


    document
        .getElementById(
            "totalFuncionarios"
        )
        .textContent =
        employees.length;


    document
        .getElementById(
            "totalTrabalhando"
        )
        .textContent =
        working;


    document
        .getElementById(
            "totalProgramadas"
        )
        .textContent =
        scheduled;


    document
        .getElementById(
            "totalEmFerias"
        )
        .textContent =
        onVacation;


    document
        .getElementById(
            "chartTotal"
        )
        .textContent =
        employees.length;


    document
        .getElementById(
            "legendWorking"
        )
        .textContent =
        working;


    document
        .getElementById(
            "legendScheduled"
        )
        .textContent =
        scheduled;


    document
        .getElementById(
            "legendVacation"
        )
        .textContent =
        onVacation;


    renderUpcomingVacations();

    renderTeamDashboard();

    renderAlerts();

}



/* =========================
   PRÓXIMAS FÉRIAS
========================= */

function renderUpcomingVacations() {

    const container =
        document
            .getElementById(
                "upcomingVacations"
            );


    const upcoming =
        vacations

            .filter(
                v =>
                    getVacationStatus(
                        v
                    ) ===
                    "Programada"
            )

            .sort(
                (a, b) =>
                    new Date(a.start) -
                    new Date(b.start)
            )

            .slice(
                0,
                5
            );


    if (
        upcoming.length === 0
    ) {

        container.innerHTML =

            `<div class="empty-state">
                Nenhuma férias programada.
            </div>`;

        return;

    }


    container.innerHTML =
        upcoming.map(
            vacation => {

                const employee =
                    employees.find(
                        e =>
                            e.id ===
                            vacation.employeeId
                    );


                const days =
                    daysUntil(
                        vacation.start
                    );


                return `

                    <div class="vacation-item">

                        <div class="vacation-person">

                            <div class="avatar">

                                ${getInitials(
                                    employee.name
                                )}

                            </div>

                            <div class="vacation-info">

                                <strong>
                                    ${employee.name}
                                </strong>

                                <span>
                                    ${formatDate(
                                        vacation.start
                                    )}
                                    →
                                    ${formatDate(
                                        vacation.end
                                    )}
                                </span>

                            </div>

                        </div>


                        <div class="countdown">

                            ${
                                days === 0
                                    ? "Hoje"
                                    : `Em ${days} dias`
                            }

                        </div>

                    </div>

                `;

            }
        ).join("");

}



/* =========================
   EQUIPE
========================= */

function renderTeamDashboard() {

    const container =
        document
            .getElementById(
                "teamDashboard"
            );


    container.innerHTML =

        employees.map(
            employee => {

                const vacation =
                    vacations.find(
                        v =>
                            v.employeeId ===
                            employee.id &&
                            (
                                getVacationStatus(
                                    v
                                ) ===
                                "Em férias" ||

                                getVacationStatus(
                                    v
                                ) ===
                                "Programada"
                            )
                    );


                let status =
                    "Trabalhando";


                if (vacation) {

                    status =
                        getVacationStatus(
                            vacation
                        );

                }


                const className =

                    status ===
                    "Em férias"

                        ? "status-vacation"

                        : status ===
                          "Programada"

                            ? "status-scheduled"

                            : "status-working";


                return `

                    <div class="team-card">

                        <div class="team-card-header">

                            <div class="avatar">

                                ${getInitials(
                                    employee.name
                                )}

                            </div>

                            <div>

                                <h3>
                                    ${employee.name}
                                </h3>

                                <small>
                                    Setor SE
                                </small>

                            </div>

                        </div>


                        <span
                            class="status-badge ${className}"
                        >

                            ${status}

                        </span>

                    </div>

                `;

            }
        ).join("");

}



/* =========================
   FUNCIONÁRIOS
========================= */

function renderEmployees() {

    const container =
        document
            .getElementById(
                "employeesGrid"
            );


    container.innerHTML =

        employees.map(
            employee => {

                return `

                    <div class="employee-card">

                        <div class="employee-avatar">

                            ${getInitials(
                                employee.name
                            )}

                        </div>

                        <h3>
                            ${employee.name}
                        </h3>

                        <p>
                            Setor SE
                        </p>

                    </div>

                `;

            }
        ).join("");

}



/* =========================
   TABELA
========================= */

function renderVacationsTable() {

    const tbody =
        document
            .getElementById(
                "vacationsTable"
            );


    if (
        vacations.length === 0
    ) {

        tbody.innerHTML =

            `<tr>

                <td
                    colspan="6"
                    style="text-align:center"
                >

                    Nenhuma férias cadastrada.

                </td>

            </tr>`;

        return;

    }


    tbody.innerHTML =

        vacations.map(
            vacation => {

                const employee =
                    employees.find(
                        e =>
                            e.id ===
                            vacation.employeeId
                    );


                const status =
                    getVacationStatus(
                        vacation
                    );


                const statusClass =

                    status ===
                    "Em férias"

                        ? "status-vacation"

                        : status ===
                          "Programada"

                            ? "status-scheduled"

                            : "status-working";


                return `

                    <tr>

                        <td>
                            <strong>
                                ${employee.name}
                            </strong>
                        </td>

                        <td>
                            ${formatDate(
                                vacation.start
                            )}
                        </td>

                        <td>
                            ${formatDate(
                                vacation.end
                            )}
                        </td>

                        <td>
                            ${calculateDays(
                                vacation.start,
                                vacation.end
                            )}
                        </td>

                        <td>

                            <span
                                class="status-badge ${statusClass}"
                            >

                                ${status}

                            </span>

                        </td>

                        <td>

                            <button
                                class="action-button"
                                onclick="editVacation(${vacation.id})"
                            >

                                <i
                                    class="fa-solid fa-pen"
                                ></i>

                            </button>


                            <button
                                class="action-button delete-button"
                                onclick="deleteVacation(${vacation.id})"
                            >

                                <i
                                    class="fa-solid fa-trash"
                                ></i>

                            </button>

                        </td>

                    </tr>

                `;

            }
        ).join("");

}



/* =========================
   MODAL
========================= */

function populateEmployeeSelect() {

    const select =
        document
            .getElementById(
                "employeeSelect"
            );


    employees.forEach(
        employee => {

            const option =
                document.createElement(
                    "option"
                );


            option.value =
                employee.id;


            option.textContent =
                employee.name;


            select.appendChild(
                option
            );

        }
    );

}



function openVacationModal(
    vacation = null
) {

    const modal =
        document
            .getElementById(
                "vacationModal"
            );


    modal.classList.add(
        "active"
    );


    if (vacation) {

        editingVacationId =
            vacation.id;


        document
            .getElementById(
                "modalTitle"
            )
            .textContent =
            "Editar férias";


        document
            .getElementById(
                "employeeSelect"
            )
            .value =
            vacation.employeeId;


        document
            .getElementById(
                "startDate"
            )
            .value =
            vacation.start;


        document
            .getElementById(
                "endDate"
            )
            .value =
            vacation.end;

    }

    else {

        editingVacationId =
            null;


        document
            .getElementById(
                "modalTitle"
            )
            .textContent =
            "Cadastrar férias";


        document
            .getElementById(
                "vacationForm"
            )
            .reset();

    }

}



function closeVacationModal() {

    document
        .getElementById(
            "vacationModal"
        )
        .classList.remove(
            "active"
        );



    document
        .getElementById(
            "conflictWarning"
        )
        .classList.add(
            "hidden"
        );

}



/* =========================
   SALVAR FÉRIAS
========================= */

document
    .getElementById(
        "vacationForm"
    )
    .addEventListener(
        "submit",
        event => {

            event.preventDefault();


            const employeeId =
                Number(
                    document
                        .getElementById(
                            "employeeSelect"
                        )
                        .value
                );


            const start =
                document
                    .getElementById(
                        "startDate"
                    )
                    .value;


            const end =
                document
                    .getElementById(
                        "endDate"
                    )
                    .value;


            if (
                new Date(start) >
                new Date(end)
            ) {

                alert(
                    "A data de início não pode ser posterior à data de término."
                );

                return;

            }


            const conflict =
                checkConflict(
                    employeeId,
                    start,
                    end,
                    editingVacationId
                );


            if (conflict) {

                const confirmSave =
                    confirm(
                        "Atenção: existe conflito com outro período de férias. Deseja salvar mesmo assim?"
                    );


                if (
                    !confirmSave
                ) {

                    return;

                }

            }


            const vacation = {

                id:
                    editingVacationId ||
                    Date.now(),

                employeeId,

                start,

                end

            };


            if (
                editingVacationId
            ) {

                vacations =
                    vacations.map(
                        v =>
                            v.id ===
                            editingVacationId
                                ? vacation
                                : v
                    );

            }

            else {

                vacations.push(
                    vacation
                );

            }


            saveData();


            closeVacationModal();


            updateAll();

        }
    );



/* =========================
   CONFLITO
========================= */

function checkConflict(
    employeeId,
    start,
    end,
    ignoreId = null
) {

    const newStart =
        new Date(
            start
        );


    const newEnd =
        new Date(
            end
        );


    return vacations.some(
        vacation => {

            if (
                vacation.id ===
                ignoreId
            ) {

                return false;

            }


            const existingStart =
                new Date(
                    vacation.start
                );


            const existingEnd =
                new Date(
                    vacation.end
                );


            return (

                newStart <=
                existingEnd &&

                newEnd >=
                existingStart

            );

        }
    );

}



/* =========================
   ALERTAS
========================= */

function renderAlerts() {

    const container =
        document
            .getElementById(
                "alertsContainer"
            );


    let alerts = [];


    const upcoming =
        vacations.filter(
            v => {

                const days =
                    daysUntil(
                        v.start
                    );


                return (

                    days >= 0 &&
                    days <= 7

                );

            }
        );


    upcoming.forEach(
        vacation => {

            const employee =
                employees.find(
                    e =>
                        e.id ===
                        vacation.employeeId
                );


            const days =
                daysUntil(
                    vacation.start
                );


            alerts.push(`

                <div class="alert warning">

                    <i
                        class="fa-solid fa-clock"
                    ></i>

                    <strong>
                        ${employee.name}
                    </strong>

                    entra de férias

                    ${
                        days === 0
                            ? "hoje"
                            : `em ${days} dias`
                    }.

                </div>

            `);

        }
    );


    if (
        alerts.length === 0
    ) {

        container.innerHTML = "";

        return;

    }


    container.innerHTML =
        alerts.join("");

}



/* =========================
   EDITAR
========================= */

function editVacation(
    id
) {

    const vacation =
        vacations.find(
            v =>
                v.id ===
                id
        );


    if (
        vacation
    ) {

        openVacationModal(
            vacation
        );

    }

}



/* =========================
   EXCLUIR
========================= */

function deleteVacation(
    id
) {

    const confirmDelete =
        confirm(
            "Deseja realmente excluir este período de férias?"
        );


    if (
        !confirmDelete
    ) {

        return;

    }


    vacations =
        vacations.filter(
            v =>
                v.id !==
                id
        );


    saveData();


    updateAll();

}



/* =========================
   SALVAR LOCALSTORAGE
========================= */

function saveData() {

    localStorage.setItem(
        "vacationsSE",
        JSON.stringify(
            vacations
        )
    );

}



/* =========================
   CALENDÁRIO
========================= */

function renderCalendar() {

    const year =
        currentCalendarDate
            .getFullYear();


    const month =
        currentCalendarDate
            .getMonth();


    const monthName =
        currentCalendarDate
            .toLocaleDateString(
                "pt-BR",
                {
                    month: "long",
                    year: "numeric"
                }
            );


    document
        .getElementById(
            "calendarTitle"
        )
        .textContent =
        capitalize(
            monthName
        );


    const grid =
        document
            .getElementById(
                "calendarGrid"
            );


    grid.innerHTML = "";


    const firstDay =
        new Date(
            year,
            month,
            1
        )
        .getDay();


    const daysInMonth =
        new Date(
            year,
            month + 1,
            0
        )
        .getDate();


    for (
        let i = 0;
        i < firstDay;
        i++
    ) {

        const empty =
            document.createElement(
                "div"
            );


        empty.className =
            "calendar-day empty";


        grid.appendChild(
            empty
        );

    }


    for (
        let day = 1;
        day <= daysInMonth;
        day++
    ) {

        const cell =
            document.createElement(
                "div"
            );


        cell.className =
            "calendar-day";


        const date =
            new Date(
                year,
                month,
                day
            );


        if (
            isToday(
                date
            )
        ) {

            cell.classList.add(
                "today"
            );

        }


        cell.innerHTML = `

            <div
                class="calendar-day-number"
            >

                ${day}

            </div>

        `;


        vacations.forEach(
            vacation => {

                const start =
                    new Date(
                        vacation.start +
                        "T00:00:00"
                    );


                const end =
                    new Date(
                        vacation.end +
                        "T00:00:00"
                    );


                if (
                    date >= start &&
                    date <= end
                ) {

                    const employee =
                        employees.find(
                            e =>
                                e.id ===
                                vacation.employeeId
                        );


                    cell.classList.add(
                        "vacation"
                    );


                    cell.innerHTML += `

                        <div
                            class="calendar-vacation-name"
                            style="
                                background-color: ${employee.color};
                            "
                        >

                            ${employee.name}

                        </div>

                    `;

                }

            }
        );


        grid.appendChild(
            cell
        );

    }

}



function changeMonth(
    direction
) {

    currentCalendarDate
        .setMonth(
            currentCalendarDate
                .getMonth() +
            direction
        );


    renderCalendar();

}



/* =========================
   UTILITÁRIOS
========================= */

function formatDate(
    date
) {

    return new Date(
        date +
        "T00:00:00"
    )
    .toLocaleDateString(
        "pt-BR"
    );

}



function getInitials(
    name
) {

    return name
        .split(" ")
        .map(
            word =>
                word[0]
        )
        .join("")
        .substring(
            0,
            2
        )
        .toUpperCase();

}



function capitalize(
    text
) {

    return text
        .charAt(0)
        .toUpperCase() +
        text.slice(1);

}



function isToday(
    date
) {

    const today =
        new Date();


    return (

        date.getDate() ===
        today.getDate() &&

        date.getMonth() ===
        today.getMonth() &&

        date.getFullYear() ===
        today.getFullYear()

    );

}



/* =========================
   ATUALIZAR SISTEMA
========================= */

function updateAll() {

    updateDashboard();

    renderEmployees();

    renderVacationsTable();

    renderCalendar();

}