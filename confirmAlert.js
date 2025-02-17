class FormConfirmation {
    constructor(formId) {
        this.form = document.getElementById(formId);

        this.fields = Array.from(this.form.elements).filter(el => ['INPUT', 'TEXTAREA', 'SELECT'].includes(el.tagName));

        this.originalValues = {};

        this.fields.forEach(field => {
            if (field.type === 'checkbox') {
                this.originalValues[field.name] = field.checked ? "はい" : "いいえ";
            } else if (field.type === 'radio' && field.checked) {
                this.originalValues[field.name] = field.labels ? field.labels[0].innerText : field.value;
            } else if (field.tagName === 'SELECT') {
                this.originalValues[field.id] = field.options[field.selectedIndex].text;
            } else {
                this.originalValues[field.id] = field.value;
            }
        });
        
        this.form.addEventListener("submit", (event) => this.handleSubmit(event));
    }
    
    handleSubmit(event) {
        event.preventDefault();
        let changes = [];
        let radioChanges = {};
        
        this.fields.forEach(field => {
            let originalValue = this.originalValues[field.name] || this.originalValues[field.id];
            let currentValue;
            
            if (field.type === 'checkbox') {
                currentValue = field.checked ? "はい" : "いいえ";
            } else if (field.type === 'radio' && field.checked) {
                currentValue = field.labels ? field.labels[0].innerText : field.value;
                radioChanges[field.name] = currentValue;
            } else if (field.tagName === 'SELECT') {
                currentValue = field.options[field.selectedIndex].text;
            } else {
                currentValue = field.value;
            }
            
            if (originalValue !== currentValue && field.type !== 'radio') {
                changes.push(`${field.labels ? field.labels[0].innerText : field.name}を「${originalValue}」から「${currentValue}」に変更`);
            }
        });
        
        Object.keys(radioChanges).forEach(name => {
            let labelElement = document.querySelector("label:not([for])")
            let displayName = labelElement ? labelElement.innerText : name;
        
            if (this.originalValues[name] && this.originalValues[name] !== radioChanges[name]) {
                changes.push(`${displayName}を「${this.originalValues[name]}」から「${radioChanges[name]}」に変更`);
            }
        });
        
        
        if (changes.length > 0) {
            Swal.fire({
                title: "確認",
                html: changes.join("<br>"),
                icon: "warning",
                showCancelButton: true,
                confirmButtonText: "送信",
                cancelButtonText: "キャンセル",
                width: '600px',
                customClass: {
                    popup: 'swal-wide'
                }
            }).then((result) => {
                if (result.isConfirmed) {
                    Swal.fire('送信されました！', '', 'success').then(() => {
                        this.form.submit();
                    });
                }
            });
        } else {
            this.form.submit();
        }
    }
}
