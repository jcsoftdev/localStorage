((d, c) => {
  // localStorage.setItem('key','value')
  const persons = [];
  const formulario = d.getElementById("form");
  const personsList = d.getElementById("personsList");
  const btn = d.getElementById('btn')
  const btnDelete = d.getElementById('delete')
  let personId = -1
  console.log(formulario.elements);
  savePerson = (e, edit=false, id) => {
    e.preventDefault();
    const target = e.target;
    const newPerson = {
      nombre: target.nombre.value,
      apellido: target.apellido.value,
      edad: target.edad.value,
      sexo: target.sexo.value
    };
    if (edit) {
      persons[personId] = newPerson;
    }else{

      persons.push(newPerson);
    }
    localStorage.setItem("persons", JSON.stringify(persons));
    c(persons);
    btn.setAttribute('data-type','save')
    btnDelete.style.display = "none";
    btn.textContent = "Guardar";
    e.target.reset();
  };
  sendDataForm = id => {
    btnDelete.style.display='block'
    btnDelete.style.color = '#000'
    btnDelete.setAttribute('onClick',`deletePerson(${id})`)
    btn.textContent='Editar'
    personId = id
    btn.setAttribute('data-type','edit')
    const personRow = d.getElementById(id).children;
    c(personRow);
    c(formulario.nombre.value);
    formulario.nombre.value = personRow[0].innerText;
    formulario.apellido.value = personRow[1].innerText;
    formulario.edad.value = personRow[2].innerText;
    formulario.sexo.value = getSexo(personRow[3].innerText, true);
  };
  /**
   * hacer que no se recargue al eliminar
   */

  deletePerson = (id) => {
    console.log(formulario);
    console.log(formulario.elements);
    for (let element = 0; element < 4; element++) {
      (formulario.elements[element].value = '');
    }
    persons.splice(id, 1)
    if (persons.length > 0) {
      console.log(persons);
      localStorage.setItem("persons", JSON.stringify(persons));
    } else {
      localStorage.removeItem("persons");
    }
    render()
    btn.textContent = "Guardar";
    btnDelete.style.display='none'
  };

  getPerson = () => {
    try {
      let data = JSON.parse(localStorage.getItem("persons"));
      return data
    } catch (error) {
      return null
    }
  };

  getSexo = (sexo, reverse = false) => {
    if (reverse) {
      if (sexo == "Masculino") {
        return "M";
      } else if (sexo == "Femenino") {
        return "F";
      }
    } else {
      if (sexo == "M") {
        return "Masculino";
      } else if (sexo == "F") {
        return "Femenino";
      }
    }
  };
  createTemplate = (data, index) => {
    return `
        <td>${data.nombre}</td>
        <td>${data.apellido}</td>
        <td>${data.edad}</td>
        <td>${getSexo(data.sexo)}</td>
    `;
  };
  render = () => {
    cleanParent(personsList);
    // nodo virtual no es parte del dom -> no existe
    const docFrag = d.createDocumentFragment();
    persons.forEach((person, index) => {
      const row = d.createElement("tr");
      row.setAttribute("id", `${index}`);
      row.setAttribute("onClick", `sendDataForm('${index}')`);
      c(person);
      row.innerHTML = createTemplate(person, index);
      docFrag.appendChild(row);
    });
    personsList.appendChild(docFrag);
  };
  cleanParent = el => {
    while (el.firstChild) {
      el.removeChild(el.firstChild);
    }
  };
  formulario.addEventListener("submit", res => {
    
    let typeSubmit = (btn.getAttribute("data-type"));
    if (typeSubmit == 'save') {
      
      this.savePerson(res);
    }else if(typeSubmit == 'edit'){
      this.savePerson(res, true)
    }
    render();
  });
  let personsStorage = getPerson()
  console.log(personsStorage);
  if (personsStorage != null) {
    
    personsStorage.map((value, index)=>{
  
      persons.push(value);
    })
  }
  console.log(persons);
  render();
})(document, console.log);
