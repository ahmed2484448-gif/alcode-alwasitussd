/* =========================================
   تطبيق الكود الوسيط
   script.js
========================================= */

let selectedService = "";
let selectedPayment = "";

let currentUSSD = "";
let pendingCallHref = "";

const HISTORY_KEY =
    "alkod_alwasit_history";

const THEME_KEY =
    "alkod_alwasit_theme";


/* =========================================
   أسماء الخدمات
========================================= */

const serviceNames = {

    jawwal: "جوال بي",

    palpay: "بال بي",

    bank: "بنك فلسطين"

};


const paymentNames = {

    friend: "الدفع لصديق",

    merchant: "الدفع لتاجر"

};


/* =========================================
   العناصر
========================================= */

const serviceButtons =
    document.querySelectorAll(".service");

const paymentButtons =
    document.querySelectorAll(".payment-type");

const receiverGroup =
    document.getElementById("receiverGroup");

const amountGroup =
    document.getElementById("amountGroup");

const notesGroup =
    document.getElementById("notesGroup");

const receiverInput =
    document.getElementById("receiver");

const amountInput =
    document.getElementById("amount");

const notesInput =
    document.getElementById("notes");

const createButton =
    document.getElementById("createButton");

const resultSection =
    document.getElementById("resultSection");

const resultMessage =
    document.getElementById("resultMessage");

const ussdCode =
    document.getElementById("ussdCode");

const callButton =
    document.getElementById("callButton");

const historyToggle =
    document.getElementById("historyToggle");

const historyCard =
    document.querySelector(".history-card");

const historyPanel =
    document.getElementById("historyPanel");

const historyContainer =
    document.getElementById("historyContainer");

const clearHistoryButton =
    document.getElementById(
        "clearHistoryButton"
    );

const themeButton =
    document.getElementById("themeButton");

const confirmModal =
    document.getElementById("confirmModal");

const confirmCallButton =
    document.getElementById(
        "confirmCallButton"
    );

const cancelCallButton =
    document.getElementById(
        "cancelCallButton"
    );

const confirmService =
    document.getElementById(
        "confirmService"
    );

const confirmPayment =
    document.getElementById(
        "confirmPayment"
    );

const confirmReceiver =
    document.getElementById(
        "confirmReceiver"
    );

const confirmAmount =
    document.getElementById(
        "confirmAmount"
    );

const confirmPaymentRow =
    document.getElementById(
        "confirmPaymentRow"
    );

const confirmReceiverRow =
    document.getElementById(
        "confirmReceiverRow"
    );

const confirmAmountRow =
    document.getElementById(
        "confirmAmountRow"
    );


/* =========================================
   أدوات
========================================= */

function showElement(element) {

    if (element) {

        element.classList.remove(
            "hidden"
        );

    }

}


function hideElement(element) {

    if (element) {

        element.classList.add(
            "hidden"
        );

    }

}


function cleanNumber(value) {

    return String(value || "")
        .trim()
        .replace(/\s+/g, "");

}


function cleanAmount(value) {

    return String(value || "")
        .trim()
        .replace(/,/g, ".");

}


/* =========================================
   اختيار جهة التحويل
========================================= */

serviceButtons.forEach(button => {

    button.addEventListener(
        "click",
        () => {

            serviceButtons.forEach(
                item => {

                    item.classList.remove(
                        "active"
                    );

                }
            );


            button.classList.add(
                "active"
            );


            selectedService =
                button.dataset.service || "";


            updateServiceFields();

        }
    );

});


/* =========================================
   اختيار طريقة الدفع
========================================= */

paymentButtons.forEach(button => {

    button.addEventListener(
        "click",
        () => {

            if (
                selectedService === "bank"
            ) {

                alert(
                    "الدفع بهذه الطريقة غير متاح لبنك فلسطين."
                );

                return;

            }


            paymentButtons.forEach(
                item => {

                    item.classList.remove(
                        "active"
                    );

                }
            );


            button.classList.add(
                "active"
            );


            selectedPayment =
                button.dataset.type || "";

        }
    );

});


/* =========================================
   تحديث الحقول
========================================= */

function updateServiceFields() {

    if (
        selectedService === "bank"
    ) {

        hideElement(
            receiverGroup
        );

        hideElement(
            amountGroup
        );

        hideElement(
            notesGroup
        );


        paymentButtons.forEach(
            button => {

                button.classList.remove(
                    "active"
                );

            }
        );


        selectedPayment = "";


        return;
    }


    showElement(
        receiverGroup
    );

    showElement(
        amountGroup
    );

    showElement(
        notesGroup
    );

}


/* =========================================
   كود جوال بي
========================================= */

function buildJawwalCode(
    password
) {

    const cleanPassword =
        cleanNumber(password);

    const receiver =
        cleanNumber(
            receiverInput.value
        );

    const amount =
        cleanAmount(
            amountInput.value
        );


    /*
       الدفع لصديق

       *110*1*الرقم السري*رقم المستلم*المبلغ#
    */

    if (
        selectedPayment === "friend"
    ) {

        return (
            "*110*1*" +
            cleanPassword +
            "*" +
            receiver +
            "*" +
            amount +
            "#"
        );

    }


    /*
       الدفع لتاجر

       *110*2*الرقم السري*رقم المستلم*المبلغ#
    */

    if (
        selectedPayment === "merchant"
    ) {

        return (
            "*110*2*" +
            cleanPassword +
            "*" +
            receiver +
            "*" +
            amount +
            "#"
        );

    }


    return "";

}


/* =========================================
   كود بال بي
========================================= */

function buildPalPayCode() {

    const receiver =
        cleanNumber(
            receiverInput.value
        );

    const amount =
        cleanAmount(
            amountInput.value
        );


    /*
       هذا الجزء حافظنا عليه
       كما كان في النسخة السابقة.
    */

    return (
        "*600*" +
        receiver +
        "*" +
        amount +
        "#"
    );

}


/* =========================================
   إنشاء العملية
========================================= */

function createCode() {

    if (!selectedService) {

        alert(
            "يرجى اختيار جهة التحويل أولاً."
        );

        return;

    }


    /*
       بنك فلسطين
    */

    if (
        selectedService === "bank"
    ) {

        currentUSSD = "";

        resultMessage.textContent =
            "سيتم تنفيذ الاتصال المباشر.";

        ussdCode.textContent =
            "اتصال مباشر";

        pendingCallHref =
            "tel:";


        showElement(
            resultSection
        );


        openConfirmation();


        return;

    }


    /*
       طريقة الدفع
    */

    if (!selectedPayment) {

        alert(
            "يرجى اختيار طريقة الدفع."
        );

        return;

    }


    const receiver =
        cleanNumber(
            receiverInput.value
        );

    const amount =
        cleanAmount(
            amountInput.value
        );


    if (!receiver) {

        alert(
            "يرجى إدخال رقم المستلم."
        );

        receiverInput.focus();

        return;

    }


    if (
        !amount ||
        Number(amount) <= 0
    ) {

        alert(
            "يرجى إدخال مبلغ صحيح."
        );

        amountInput.focus();

        return;

    }


    /*
       جوال بي
       الرقم السري لا يظهر هنا.
    */

    if (
        selectedService === "jawwal"
    ) {

        currentUSSD = "";

        ussdCode.textContent =
            "سيُطلب الرقم السري عند تأكيد الاتصال.";

        resultMessage.textContent =
            "تم تجهيز العملية. اضغط تأكيد الاتصال لإدخال الرقم السري.";

    }


    /*
       بال بي
    */

    else if (
        selectedService === "palpay"
    ) {

        currentUSSD =
            buildPalPayCode();


        if (!currentUSSD) {

            alert(
                "تعذر إنشاء كود العملية."
            );

            return;

        }


        ussdCode.textContent =
            currentUSSD;

        resultMessage.textContent =
            "تم تجهيز كود العملية.";


        pendingCallHref =
            "tel:" +
            encodeURIComponent(
                currentUSSD
            );

    }


    showElement(
        resultSection
    );


    openConfirmation();

}


/* =========================================
   زر إنشاء العملية
========================================= */

if (createButton) {

    createButton.addEventListener(
        "click",
        createCode
    );

}


/* =========================================
   نافذة التأكيد
========================================= */

function openConfirmation() {

    if (!confirmModal) {
        return;
    }


    confirmService.textContent =
        serviceNames[selectedService] ||
        "-";


    if (selectedPayment) {

        showElement(
            confirmPaymentRow
        );

        confirmPayment.textContent =
            paymentNames[selectedPayment] ||
            "-";

    } else {

        hideElement(
            confirmPaymentRow
        );

    }


    const receiver =
        cleanNumber(
            receiverInput
                ? receiverInput.value
                : ""
        );


    const amount =
        cleanAmount(
            amountInput
                ? amountInput.value
                : ""
        );


    if (
        selectedService === "bank"
    ) {

        hideElement(
            confirmReceiverRow
        );

        hideElement(
            confirmAmountRow
        );

    } else {

        showElement(
            confirmReceiverRow
        );

        showElement(
            confirmAmountRow
        );


        confirmReceiver.textContent =
            receiver || "-";


        confirmAmount.textContent =
            amount
                ? amount + " شيكل"
                : "-";

    }


    showElement(
        confirmModal
    );

}


/* =========================================
   إغلاق التأكيد
========================================= */

function closeConfirmation() {

    hideElement(
        confirmModal
    );

}


/* =========================================
   نافذة الرقم السري
========================================= */

function askForJawwalPassword() {

    return new Promise(resolve => {

        const modal =
            document.createElement(
                "div"
            );


        modal.className =
            "confirm-modal";


        modal.innerHTML = `

            <div
                class="confirm-overlay"
            ></div>

            <div class="confirm-box">

                <div class="confirm-icon">
                    🔐
                </div>

                <h2>
                    الرقم السري
                </h2>

                <p class="confirm-text">
                    أدخل الرقم السري لجوال بي لإكمال الاتصال
                </p>

                <div
                    class="input-group"
                    style="text-align:right;"
                >

                    <label
                        for="jawwalPasswordInput"
                    >
                        الرقم السري
                    </label>

                    <input
                        id="jawwalPasswordInput"
                        type="password"
                        inputmode="numeric"
                        autocomplete="off"
                        maxlength="20"
                        placeholder="أدخل الرقم السري"
                        style="
                            width:100%;
                            padding:14px;
                            border-radius:12px;
                            border:1px solid #25465c;
                            background:#07151f;
                            color:white;
                            outline:none;
                            font-size:16px;
                        "
                    >

                </div>

                <div class="confirm-buttons">

                    <button
                        id="jawwalPasswordConfirm"
                        class="confirm-yes"
                        type="button"
                    >
                        ✓ متابعة الاتصال
                    </button>

                    <button
                        id="jawwalPasswordCancel"
                        class="confirm-no"
                        type="button"
                    >
                        إلغاء
                    </button>

                </div>

            </div>
        `;


        document.body.appendChild(
            modal
        );


        const passwordInput =
            modal.querySelector(
                "#jawwalPasswordInput"
            );


        const confirmButton =
            modal.querySelector(
                "#jawwalPasswordConfirm"
            );


        const cancelButton =
            modal.querySelector(
                "#jawwalPasswordCancel"
            );


        const overlay =
            modal.querySelector(
                ".confirm-overlay"
            );


        setTimeout(
            () => {

                passwordInput.focus();

            },
            100
        );


        function finish(value) {

            /*
               حذف النافذة مباشرة.
               الرقم السري لا يتم تخزينه.
            */

            modal.remove();

            resolve(value);

        }


        confirmButton.addEventListener(
            "click",
            () => {

                const password =
                    cleanNumber(
                        passwordInput.value
                    );


                if (!password) {

                    alert(
                        "يرجى إدخال الرقم السري."
                    );

                    passwordInput.focus();

                    return;

                }


                finish(password);

            }
        );


        cancelButton.addEventListener(
            "click",
            () => {

                finish(null);

            }
        );


        overlay.addEventListener(
            "click",
            () => {

                finish(null);

            }
        );


        passwordInput.addEventListener(
            "keydown",
            event => {

                if (
                    event.key === "Enter"
                ) {

                    confirmButton.click();

                }


                if (
                    event.key === "Escape"
                ) {

                    finish(null);

                }

            }
        );

    });

}


/* =========================================
   تأكيد الاتصال
========================================= */

if (confirmCallButton) {

    confirmCallButton.addEventListener(
        "click",
        async () => {


            /* =========================
               جوال بي
            ========================= */

            if (
                selectedService ===
                "jawwal"
            ) {

                closeConfirmation();


                const password =
                    await askForJawwalPassword();


                if (!password) {

                    return;

                }


                /*
                   إنشاء كود جوال بي
                   بعد إدخال الرقم السري فقط
                */

                currentUSSD =
                    buildJawwalCode(
                        password
                    );


                if (!currentUSSD) {

                    alert(
                        "تعذر إنشاء كود جوال بي."
                    );

                    return;

                }


                pendingCallHref =
                    "tel:" +
                    encodeURIComponent(
                        currentUSSD
                    );


                /*
                   لا يتم حفظ الرقم السري.
                */

                saveHistory();


                /*
                   الاتصال
                */

                window.location.href =
                    pendingCallHref;


                return;

            }


            /* =========================
               بنك فلسطين
            ========================= */

            if (
                selectedService ===
                "bank"
            ) {

                closeConfirmation();


                saveHistory();


                /*
                   لا نضع رقمًا سريًا
                   أو بيانات غير مطلوبة.
                */

                /*
                   لا يوجد رقم اتصال لبنك فلسطين
                   مخزن هنا لأن الرقم لم يتم تحديده.
                */

                alert(
                    "تم تأكيد العملية."
                );


                return;

            }


            /* =========================
               بال بي
            ========================= */

            if (
                selectedService ===
                "palpay"
            ) {

                closeConfirmation();


                if (
                    pendingCallHref
                ) {

                    saveHistory();


                    window.location.href =
                        pendingCallHref;

                }

            }

        }
    );

}


/* =========================================
   زر الإلغاء
========================================= */

if (cancelCallButton) {

    cancelCallButton.addEventListener(
        "click",
        closeConfirmation
    );

}


/* =========================================
   السجل
========================================= */

function getHistory() {

    try {

        const saved =
            localStorage.getItem(
                HISTORY_KEY
            );


        if (!saved) {

            return [];

        }


        const data =
            JSON.parse(saved);


        if (
            !Array.isArray(data)
        ) {

            return [];

        }


        return data;

    } catch (error) {

        console.log(
            "خطأ في قراءة السجل",
            error
        );

        return [];

    }

}


/* =========================================
   حفظ الحركة
========================================= */

function saveHistory() {

    const history =
        getHistory();


    const item = {

        id:
            Date.now(),

        service:
            selectedService,

        serviceName:
            serviceNames[
                selectedService
            ] || selectedService,

        payment:
            selectedPayment,

        paymentName:
            paymentNames[
                selectedPayment
            ] || "",

        receiver:
            cleanNumber(
                receiverInput
                    ? receiverInput.value
                    : ""
            ),

        amount:
            cleanAmount(
                amountInput
                    ? amountInput.value
                    : ""
            ),

        notes:
            notesInput
                ? notesInput.value.trim()
                : "",

        /*
           مهم:
           لا يتم حفظ الرقم السري.
        */

        code:
            currentUSSD,

        /*
           حالة العملية
        */

        status:
            "تمت العملية",

        completed:
            true,

        date:
            new Date().toLocaleString(
                "ar-PS"
            )

    };


    history.unshift(
        item
    );


    const limitedHistory =
        history.slice(
            0,
            100
        );


    try {

        localStorage.setItem(
            HISTORY_KEY,
            JSON.stringify(
                limitedHistory
            )
        );

    } catch (error) {

        console.log(
            "تعذر حفظ السجل",
            error
        );

    }


    renderHistory();

}


/* =========================================
   عرض السجل
========================================= */

function renderHistory() {

    if (!historyContainer) {

        return;

    }


    const history =
        getHistory();


    if (
        history.length === 0
    ) {

        historyContainer.innerHTML = `

            <div class="empty-history">
                لا توجد عمليات حتى الآن
            </div>

        `;

        return;

    }


    historyContainer.innerHTML =
        history.map(
            (item, index) => {

                return `

                    <div
                        class="history-item"
                        data-id="${item.id}"
                    >

                        <button
                            class="history-summary"
                            type="button"
                        >

                            <span
                                class="history-summary-info"
                            >

                                <span
                                    class="history-number"
                                >
                                    ${index + 1}
                                </span>


                                <span
                                    class="history-summary-text"
                                >

                                    <strong>
                                        ${escapeHTML(
                                            item.serviceName ||
                                            "عملية"
                                        )}
                                    </strong>


                                    <small>
                                        ${escapeHTML(
                                            item.date ||
                                            ""
                                        )}
                                    </small>


                                    <span
                                        class="operation-done"
                                    >
                                        ✓ تمت العملية
                                    </span>

                                </span>

                            </span>


                            <span
                                class="history-arrow"
                            >
                                ‹
                            </span>

                        </button>


                        <div
                            class="history-content"
                        >

                            <div
                                class="history-details"
                            >

                                <div
                                    class="history-detail-row"
                                >

                                    <span>
                                        الخدمة
                                    </span>

                                    <strong>
                                        ${escapeHTML(
                                            item.serviceName ||
                                            "-"
                                        )}
                                    </strong>

                                </div>


                                ${
                                    item.paymentName
                                        ? `

                                    <div
                                        class="history-detail-row"
                                    >

                                        <span>
                                            طريقة الدفع
                                        </span>

                                        <strong>
                                            ${escapeHTML(
                                                item.paymentName
                                            )}
                                        </strong>

                                    </div>

                                    `
                                        : ""
                                }


                                ${
                                    item.receiver
                                        ? `

                                    <div
                                        class="history-detail-row"
                                    >

                                        <span>
                                            رقم المستلم
                                        </span>

                                        <strong>
                                            ${escapeHTML(
                                                item.receiver
                                            )}
                                        </strong>

                                    </div>

                                    `
                                        : ""
                                }


                                ${
                                    item.amount
                                        ? `

                                    <div
                                        class="history-detail-row"
                                    >

                                        <span>
                                            المبلغ
                                        </span>

                                        <strong>
                                            ${escapeHTML(
                                                item.amount
                                            )}
                                            شيكل
                                        </strong>

                                    </div>

                                    `
                                        : ""
                                }


                                ${
                                    item.notes
                                        ? `

                                    <div
                                        class="history-detail-row"
                                    >

                                        <span>
                                            الملاحظات
                                        </span>

                                        <strong>
                                            ${escapeHTML(
                                                item.notes
                                            )}
                                        </strong>

                                    </div>

                                    `
                                        : ""
                                }


                                ${
                                    item.code
                                        ? `

                                    <div
                                        class="history-code"
                                    >
                                        ${escapeHTML(
                                            item.code
                                        )}
                                    </div>

                                    `
                                        : ""
                                }


                                <div
                                    class="operation-status"
                                >
                                    ✓ تمت العملية
                                </div>


                                <button
                                    class="delete-history-button"
                                    type="button"
                                    data-delete-id="${item.id}"
                                >
                                    🗑 حذف من السجل
                                </button>

                            </div>

                        </div>

                    </div>

                `;

            }
        ).join("");


    attachHistoryEvents();

}


/* =========================================
   أحداث السجل
========================================= */

function attachHistoryEvents() {

    const items =
        historyContainer.querySelectorAll(
            ".history-item"
        );


    items.forEach(item => {

        const summary =
            item.querySelector(
                ".history-summary"
            );


        if (summary) {

            summary.addEventListener(
                "click",
                () => {

                    item.classList.toggle(
                        "open"
                    );

                }
            );

        }


        const deleteButton =
            item.querySelector(
                ".delete-history-button"
            );


        if (deleteButton) {

            deleteButton.addEventListener(
                "click",
                event => {

                    event.stopPropagation();


                    const id =
                        Number(
                            deleteButton
                                .dataset
                                .deleteId
                        );


                    deleteHistory(id);

                }
            );

        }

    });

}


/* =========================================
   حذف حركة
========================================= */

function deleteHistory(id) {

    const history =
        getHistory();


    const filtered =
        history.filter(
            item =>
                Number(item.id) !==
                Number(id)
        );


    try {

        localStorage.setItem(
            HISTORY_KEY,
            JSON.stringify(
                filtered
            )
        );

    } catch (error) {

        console.log(
            error
        );

    }


    renderHistory();

}


/* =========================================
   حذف كل السجل
========================================= */

if (clearHistoryButton) {

    clearHistoryButton.addEventListener(
        "click",
        () => {

            const history =
                getHistory();


            if (
                history.length === 0
            ) {

                alert(
                    "السجل فارغ بالفعل."
                );

                return;

            }


            const confirmed =
                confirm(
                    "هل أنت متأكد من حذف جميع الحركات؟"
                );


            if (!confirmed) {

                return;

            }


            localStorage.removeItem(
                HISTORY_KEY
            );


            renderHistory();

        }
    );

}


/* =========================================
   فتح السجل
========================================= */

if (historyToggle) {

    historyToggle.addEventListener(
        "click",
        () => {

            historyCard.classList.toggle(
                "open"
            );


            const isOpen =
                historyCard.classList.contains(
                    "open"
                );


            historyToggle.setAttribute(
                "aria-expanded",
                String(isOpen)
            );

        }
    );

}


/* =========================================
   الوضع الليلي
========================================= */

function loadTheme() {

    const savedTheme =
        localStorage.getItem(
            THEME_KEY
        );


    if (
        savedTheme === "light"
    ) {

        document.body.classList.add(
            "light-mode"
        );


        themeButton.textContent =
            "🌙";

    } else {

        document.body.classList.remove(
            "light-mode"
        );


        themeButton.textContent =
            "☀️";

    }

}


if (themeButton) {

    themeButton.addEventListener(
        "click",
        () => {

            document.body.classList.toggle(
                "light-mode"
            );


            const isLight =
                document.body.classList.contains(
                    "light-mode"
                );


            localStorage.setItem(
                THEME_KEY,
                isLight
                    ? "light"
                    : "dark"
            );


            themeButton.textContent =
                isLight
                    ? "🌙"
                    : "☀️";

        }
    );

}


/* =========================================
   حماية النصوص
========================================= */

function escapeHTML(value) {

    return String(value ?? "")
        .replace(
            /&/g,
            "&amp;"
        )
        .replace(
            /</g,
            "&lt;"
        )
        .replace(
            />/g,
            "&gt;"
        )
        .replace(
            /"/g,
            "&quot;"
        )
        .replace(
            /'/g,
            "&#039;"
        );

}


/* =========================================
   زر Escape
========================================= */

document.addEventListener(
    "keydown",
    event => {

        if (
            event.key === "Escape"
        ) {

            closeConfirmation();

        }

    }
);


/* =========================================
   التشغيل
========================================= */

loadTheme();

renderHistory();

updateServiceFields();


/* =========================================
   Service Worker
========================================= */

if (
    "serviceWorker" in navigator
) {

    window.addEventListener(
        "load",
        () => {

            navigator.serviceWorker
                .register(
                    "service-worker.js"
                )
                .then(
                    () => {

                        console.log(
                            "Service Worker registered."
                        );

                    }
                )
                .catch(
                    error => {

                        console.log(
                            "Service Worker error:",
                            error
                        );

                    }
                );

        }
    );

}