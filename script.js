async function loadBugs() {

    const res = await fetch("/bugs");
    const bugs = await res.json();

    const table = document.getElementById("bugTable");

    table.innerHTML =
    "<tr><th>Title</th><th>Priority</th><th>Status</th><th>Action</th></tr>";

    let open=0, progress=0, closed=0;

    bugs.forEach(bug => {

        if(bug.status=="Open") open++;
        else if(bug.status=="In Progress") progress++;
        else closed++;

        table.innerHTML += `
        <tr>
        <td>${bug.title}</td>
        <td>${bug.priority}</td>
        <td>${bug.status}</td>
        <td>
        <button onclick="update(${bug.id},'Closed')">Close</button>
        </td>
        </tr>`;
    });

    drawChart(open, progress, closed);
}

async function addBug() {

    const title = document.getElementById("title").value;
    const priority = document.getElementById("priority").value;

    await fetch("/bugs", {
        method:"POST",
        headers:{"Content-Type":"application/json"},
        body: JSON.stringify({title, priority})
    });

    loadBugs();
}

async function update(id, status) {

    await fetch("/bugs/"+id, {
        method:"PUT",
        headers:{"Content-Type":"application/json"},
        body: JSON.stringify({status})
    });

    loadBugs();
}

function drawChart(open, progress, closed) {

    new Chart(document.getElementById("chart"), {
        type:"pie",
        data:{
            labels:["Open","In Progress","Closed"],
            datasets:[{
                data:[open,progress,closed]
            }]
        }
    });
}

loadBugs();
