body {
    font-family: Arial, sans-serif;
    text-align: center;
    background-color: #f4f4f4;
    margin: 0;
    padding: 20px;
}

h1 {
    margin-bottom: 30px;
}

table {
    border-collapse: collapse;
    margin: 20px auto;
    table-layout: fixed;
}

th, td {
    border: 1px solid #ccc;
    padding: 10px;
    width: 120px;
    height: 120px;
    vertical-align: top;
    position: relative;
    cursor: pointer;
    background-color: #fff;
    transition: background 0.3s;
}

th {
    background-color: #007bff;
    color: white;
    font-size: 14px;
}

td:hover {
    background-color: #e6f0ff;
}

.birthday {
    background-color: #ffe066 !important;
    font-weight: bold;
}

.cell-text {
    margin-top: 5px;
    font-size: 12px;
    text-align: left;
}

.birthday-text {
    color: #d6336c;
    font-weight: bold;
    font-size: 14px;
}

/* Modal Styles */
.modal {
    display: none;
    position: fixed;
    top: 0; left: 0; right:0; bottom:0;
    background: rgba(0,0,0,0.5);
    z-index: 10;
}

.modal-content {
    background: white;
    padding: 20px;
    margin: 100px auto;
    width: 300px;
    border-radius: 10px;
    text-align: left;
}

#close {
    float: right;
    cursor: pointer;
    font-weight: bold;
    font-size: 18px;
}

label, select, button {
    display: block;
    width: 100%;
    margin: 10px 0;
}

button {
    padding: 8px;
    background-color: #007bff;
    color: white;
    border: none;
    border-radius: 5px;
    cursor: pointer;
}

button:hover {
    background-color: #0056b3;
}
