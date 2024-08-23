
document.addEventListener('DOMContentLoaded', function() {

        const textarea = document.getElementById('jsonData');
    
        document.querySelector('.copy-icon').addEventListener('click', function() {
            textarea.select();
            document.execCommand('copy');

            alert('JSON verisi kopyalandı!');
        });
    
        document.querySelector('.download-icon').addEventListener('click', function() {
            const data = textarea.value;
            const blob = new Blob([data], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
    
            const a = document.createElement('a');
            a.href = url;
            a.download = 'lweaxodb.json';
            a.click();

            URL.revokeObjectURL(url);
        });
    let data;

    function fetchData() {
        data = document.getElementById('jsonData').value;
    }
    fetchData();

    document.getElementById('saveButton').addEventListener('click', function() {
        data = document.getElementById('jsonData').value;

        fetch('/save', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(JSON.parse(data))
        })
        .then(response => response.json())
        .then(result => {
            alert("📢 Data Başarılı Şekilde Kaydedildi!")
        })
        .catch(err => {
            console.error('❌ Error saving data:', err);
            alert('❌ Data Kaydedilirken Sorun Oluştu.');
        });
        console.log("📢 DataBase Bilgileri Başayırla Kayıt Edildi!")
    });
});
