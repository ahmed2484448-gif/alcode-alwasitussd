/* ==========================================
   تطبيق الكود الوسيط
========================================== */


/* ==========================================
   عناصر الصفحة
========================================== */

const serviceButtons =
    document.querySelectorAll(".service");

const paymentButtons =
    document.querySelectorAll(".payment-type");

const paymentCard =
    document.getElementById("paymentCard");

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

const ussdCode =
    document.getElementById("ussdCode");

const resultMessage =
    document.getElementById("resultMessage");

const callButton =
    document.getElementById("callButton");

const historyContainer =
    document.getElementById("historyContainer");

const clearHistoryButton =
    document.getElementById("clearHistoryButton");

const themeButton =
    document.getElementById("themeButton");

const historyToggle =
    document.getElementById("historyToggle");

const historyCard =
    document.querySelector(".history-card");


/* ==========================================
   نافذة التأكيد
========================================== */

const confirmModal =
    document.getElementById("confirmModal");

const confirmService =
    document.getElementById("confirmService");

const confirmPayment =
    document.getElementById("confirmPayment");

const confirmReceiver =
    document.getElementById("confirmReceiver");

const confirmAmount =
    document.getElementById("confirmAmount");

const confirmPaymentRow =
    document.getElementById("confirmPaymentRow");

const confirmReceiverRow =
    document.getElementById("confirmReceiverRow");

const confirmAmountRow =
    document.getElementById("confirmAmountRow");

const confirmCallButton =
    document.getElementById("confirmCallButton");

const cancelCallButton =
    document.getElementById("cancelCallButton");


/* ==========================================
   المتغيرات
========================================== */

let selectedService = null;

let selectedPaymentType = null;

let currentUssdCode = "";


/* ==========================================
   أسماء الخدمات
========================================== */

const serviceNames = {

    jawwal: "جوال بي",

    palpay: "بال بي",

    bank: "بنك فلسطين"

};


/* ==========================================
   أسماء طرق الدفع
========================================== */

const paymentNames = {

    friend: "الدفع لصديق",

    merchant: "الدفع لتاجر"

};


/* ==========================================
   اختيار جهة التحويل
========================================== */

serviceButtons.forEach(button => {

    button.addEventListener("click", () => {

        serviceButtons.forEach(item => {

            item.classList.remove("active");

        });

        button.classList.add("active");

        selectedService =
            button.dataset.service;

        selectedPaymentType = null;

        paymentButtons.forEach(item => {

            item.classList.remove("active");

        });

        resultSection.classList.add("hidden");


        /* ==================================
           بنك فلسطين
        ================================== */

        if (selectedService === "bank") {

            /*
             * إخفاء كل البيانات التي لا يحتاجها
             * بنك فلسطين
             */

            paymentCard.classList.add(
                "hidden"
            );

            receiverGroup.classList.add(
                "hidden"
            );

            amountGroup.classList.add(
                "hidden"
            );

            notesGroup.classList.add(
                "hidden"
            );


            createButton.textContent =
                "متابعة التحويل عبر بنك فلسطين";


            return;
        }


        /* ==================================
           جوال بي / بال بي
        ================================== */

        paymentCard.classList.remove(
            "hidden"
        );

        receiverGroup.classList.remove(
            "hidden"
        );

        amountGroup.classList.remove(
            "hidden"
        );

        notesGroup.classList.remove(
            "hidden"
        );

        createButton.textContent =
            "إنشاء الكود وإكمال العملية";

    });

});


/* ==========================================
   اختيار طريقة الدفع
========================================== */

paymentButtons.forEach(button => {

    button.addEventListener("click", () => {

        paymentButtons.forEach(item => {

            item.classList.remove(
                "active"
            );

        });

        button.classList.add(
            "active"
        );

        selectedPaymentType =
            button.dataset.type;

    });

});


/* ==========================================
   إنشاء العملية
========================================== */

createButton.addEventListener(
    "click",
    () => {


        /* لا توجد جهة */

        if (!selectedService) {

            alert(
                "يرجى اختيار جهة التحويل أولاً."
            );

            return;

        }


        /* ==================================
           بنك فلسطين
        ================================== */

        if (selectedService === "bank") {

            currentUssdCode =
                "*267#";


            showResult(
                "*267#",
                "كود بنك فلسطين جاهز للاتصال المباشر."
            );


            saveHistory({

                service:
                    "بنك فلسطين",

                payment:
                    "تحويل مباشر",

                receiver:
                    "-",

                amount:
                    "-",

                notes:
                    "-",

                code:
                    "*267#"

            });


            return;
        }


        /* ==================================
           جوال / بال بي
        ================================== */

        if (!selectedPaymentType) {

            alert(
                "يرجى اختيار طريقة الدفع."
            );

            return;

        }


        const receiver =
            receiverInput.value.trim();

        const amount =
            amountInput.value.trim();

        const notes =
            notesInput.value.trim();


        /* رقم المستلم */

        if (!receiver) {

            alert(
                "يرجى إدخال رقم المستلم."
            );

            receiverInput.focus();

            return;

        }


        const cleanReceiver =
            receiver.replace(
                /\s/g,
                ""
            );


        if (
            !/^\d+$/.test(
                cleanReceiver
            )
        ) {

            alert(
                "رقم المستلم يجب أن يحتوي على أرقام فقط."
            );

            receiverInput.focus();

            return;

        }


        /* المبلغ */

        if (!amount) {

            alert(
                "يرجى إدخال المبلغ."
            );

            amountInput.focus();

            return;

        }


        const numericAmount =
            Number(amount);


        if (
            !Number.isFinite(
                numericAmount
            ) ||
            numericAmount <= 0
        ) {

            alert(
                "يرجى إدخال مبلغ صحيح."
            );

            amountInput.focus();

            return;

        }


        /* ==================================
           إنشاء USSD
        ================================== */

        let code = "";


        /* جوال بي */

        if (selectedService === "jawwal") {

            if (
                selectedPaymentType ===
                "friend"
            ) {

                code =
                    `*110*1*${cleanReceiver}*${numericAmount}#`;

            } else {

                code =
                    `*110*2*${cleanReceiver}*${numericAmount}#`;

            }

        }


        /* بال بي */

        if (selectedService === "palpay") {

            if (
                selectedPaymentType ===
                "friend"
            ) {

                code =
                    `*370*1*1*${cleanReceiver}*${numericAmount}#`;

            } else {

                code =
                    `*370*1*2*${cleanReceiver}*${numericAmount}#`;

            }

        }


        if (!code) {

            alert(
                "تعذر إنشاء الكود."
            );

            return;

        }


        currentUssdCode =
            code;


        showResult(
            code,
            `كود ${serviceNames[selectedService]} جاهز للتنفيذ.`
        );


        saveHistory({

            service:
                serviceNames[selectedService],

            payment:
                paymentNames[selectedPaymentType],

            receiver:
                cleanReceiver,

            amount:
                numericAmount,

            notes:
                notes || "-",

            code:
                code

        });

    }
);


/* ==========================================
   عرض النتيجة
========================================== */

function showResult(
    code,
    message
) {

    ussdCode.textContent =
        code;

    resultMessage.textContent =
        message;

    resultSection.classList.remove(
        "hidden"
    );


    setTimeout(() => {

        resultSection.scrollIntoView({

            behavior:
                "smooth",

            block:
                "center"

        });

    }, 100);

}


/* ==========================================
   فتح سجل الحركات
========================================== */

historyToggle.addEventListener(
    "click",
    () => {

        const isOpen =
            historyCard.classList.contains(
                "open"
            );


        historyCard.classList.toggle(
            "open"
        );


        historyToggle.setAttribute(
            "aria-expanded",
            String(!isOpen)
        );

    }
);


/* ==========================================
   فتح نافذة تأكيد الاتصال
========================================== */

callButton.addEventListener(
    "click",
    event => {

        event.preventDefault();


        if (!currentUssdCode) {

            return;

        }


        confirmService.textContent =
            serviceNames[selectedService] ||
            "-";


        /* بنك فلسطين */

        if (selectedService === "bank") {

            confirmPaymentRow.classList.add(
                "hidden"
            );

            confirmReceiverRow.classList.add(
                "hidden"
            );

            confirmAmountRow.classList.add(
                "hidden"
            );

        }


        /* جوال / بال بي */

        else {

            confirmPaymentRow.classList.remove(
                "hidden"
            );

            confirmReceiverRow.classList.remove(
                "hidden"
            );

            confirmAmountRow.classList.remove(
                "hidden"
            );


            confirmPayment.textContent =
                paymentNames[
                    selectedPaymentType
                ] || "-";


            confirmReceiver.textContent =
                receiverInput.value.trim() ||
                "-";


            confirmAmount.textContent =
                `${amountInput.value} شيكل`;

        }


        confirmModal.classList.remove(
            "hidden"
        );


        document.body.style.overflow =
            "hidden";

    }
);


/* ==========================================
   إغلاق نافذة التأكيد
========================================== */

function closeConfirmModal() {

    confirmModal.classList.add(
        "hidden"
    );

    document.body.style.overflow =
        "";

}


cancelCallButton.addEventListener(
    "click",
    closeConfirmModal
);


document
    .querySelector(".confirm-overlay")
    .addEventListener(
        "click",
        closeConfirmModal
    );


/* ==========================================
   الاتصال
========================================== */

confirmCallButton.addEventListener(
    "click",
    () => {

        closeConfirmModal();


        if (!currentUssdCode) {

            return;

        }


        window.location.href =
            `tel:${encodeURIComponent(
                currentUssdCode
            )}`;

    }
);


/* ==========================================
   Local Storage
========================================== */

function getHistory() {

    try {

        const data =
            JSON.parse(
                localStorage.getItem(
                    "alcode_history"
                )
            );


        return Array.isArray(data)
            ? data
            : [];

    } catch {

        return [];

    }

}


/* ==========================================
   حفظ الحركة
========================================== */

function saveHistory(operation) {

    const history =
        getHistory();


    history.unshift({

        ...operation,

        id:
            Date.now() +
            Math.random()
                .toString(16)
                .slice(2),

        date:
            new Date().toLocaleString(
                "ar-PS"
            )

    });


    localStorage.setItem(

        "alcode_history",

        JSON.stringify(
            history.slice(0, 50)
        )

    );


    renderHistory();

}


/* ==========================================
   عرض السجل
========================================== */

function renderHistory() {

    const history =
        getHistory();


    if (!history.length) {

        historyContainer.innerHTML = `

            <div class="empty-history">
                لا توجد عمليات حتى الآن
            </div>

        `;

        return;

    }


    historyContainer.innerHTML = "";


    history.forEach(
        (item, index) => {

            const element =
                document.createElement(
                    "div"
                );


            element.className =
                "history-item";


            const amount =
                item.amount === "-"
                    ? "-"
                    : `${item.amount} شيكل`;


            element.innerHTML = `

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
                                    item.service
                                )}
                            </strong>

                            <small>
                                ${escapeHTML(
                                    amount
                                )}
                            </small>

                        </span>

                    </span>


                    <span class="history-arrow">
                        ‹
                    </span>

                </button>


                <div class="history-content">

                    <div class="history-details">


                        <div class="history-detail-row">

                            <span>
                                نوع العملية
                            </span>

                            <strong>
                                ${escapeHTML(
                                    item.payment
                                )}
                            </strong>

                        </div>


                        ${
                            item.receiver !== "-"
                                ? `

                                <div class="history-detail-row">

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
                            item.amount !== "-"
                                ? `

                                <div class="history-detail-row">

                                    <span>
                                        المبلغ
                                    </span>

                                    <strong>
                                        ${escapeHTML(
                                            amount
                                        )}
                                    </strong>

                                </div>

                                `
                                : ""
                        }


                        ${
                            item.notes &&
                            item.notes !== "-"
                                ? `

                                <div class="history-detail-row">

                                    <span>
                                        ملاحظات
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


                        <div class="history-detail-row">

                            <span>
                                التاريخ
                            </span>

                            <strong>
                                ${escapeHTML(
                                    item.date
                                )}
                            </strong>

                        </div>


                        <div class="history-code">
                            ${escapeHTML(
                                item.code
                            )}
                        </div>


                        <button
                            class="delete-history-button"
                            type="button"
                            data-id="${item.id}"
                        >
                            🗑️ حذف الحركة
                        </button>

                    </div>

                </div>

            `;


            historyContainer.appendChild(
                element
            );

        }
    );


    /* فتح الحركة */

    document
        .querySelectorAll(
            ".history-summary"
        )
        .forEach(button => {

            button.addEventListener(
                "click",
                () => {

                    const item =
                        button.closest(
                            ".history-item"
                        );


                    item.classList.toggle(
                        "open"
                    );

                }
            );

        });


    /* حذف الحركة */

    document
        .querySelectorAll(
            ".delete-history-button"
        )
        .forEach(button => {

            button.addEventListener(
                "click",
                event => {

                    event.stopPropagation();


                    deleteHistory(
                        button.dataset.id
                    );

                }
            );

        });

}


/* ==========================================
   حذف حركة
========================================== */

function deleteHistory(id) {

    const confirmed =
        confirm(
            "هل تريد حذف هذه الحركة؟"
        );


    if (!confirmed) {

        return;

    }


    const history =
        getHistory().filter(
            item =>
                String(item.id) !==
                String(id)
        );


    localStorage.setItem(

        "alcode_history",

        JSON.stringify(history)

    );


    renderHistory();

}


/* ==========================================
   مسح السجل
========================================== */

clearHistoryButton.addEventListener(
    "click",
    event => {

        event.stopPropagation();


        if (!getHistory().length) {

            alert(
                "السجل فارغ."
            );

            return;

        }


        const confirmed =
            confirm(
                "هل أنت متأكد من مسح جميع الحركات؟"
            );


        if (!confirmed) {

            return;

        }


        localStorage.removeItem(
            "alcode_history"
        );


        renderHistory();

    }
);


/* ==========================================
   الوضع الليلي
========================================== */

function updateThemeIcon() {

    themeButton.textContent =
        document.body.classList.contains(
            "dark"
        )
            ? "☀️"
            : "🌙";

}


themeButton.addEventListener(
    "click",
    () => {

        document.body.classList.toggle(
            "dark"
        );


        const mode =
            document.body.classList.contains(
                "dark"
            )
                ? "dark"
                : "light";


        localStorage.setItem(
            "alcode_theme",
            mode
        );


        updateThemeIcon();

    }
);


const savedTheme =
    localStorage.getItem(
        "alcode_theme"
    );


if (savedTheme === "dark") {

    document.body.classList.add(
        "dark"
    );

}


updateThemeIcon();


/* ==========================================
   حماية النصوص
========================================== */

function escapeHTML(value) {

    if (
        value === null ||
        value === undefined
    ) {

        return "";

    }


    return String(value)

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


/* ==========================================
   تشغيل السجل
========================================== */

renderHistory();