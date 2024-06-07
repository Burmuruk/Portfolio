document.addEventListener("DOMContentLoaded", SaveSections);

let videoSection = 0;
let projectsSection = 0;
let curriculumSection = 0;
let currentElement = null;

function SaveSections(){
    videoSection = document.getElementById("DemoReelSection");
    projectsSection = document.getElementById("projectsSection");
    curriculumSection = document.getElementById("cvSection");
    
    document.getElementById("sectionsContainer").removeChild(projectsSection);
    document.getElementById("sectionsContainer").removeChild(curriculumSection);
    document.getElementById("sectionsContainer").removeChild(videoSection);
    // currentElement = videoSection;
}

function showDemoReel(){

    if (currentElement == videoSection){
        document.getElementById("sectionsContainer").removeChild(currentElement);
        currentElement = null;
        return;
    }
    
    if (currentElement != null)
        document.getElementById("sectionsContainer").removeChild(currentElement);

    document.getElementById("sectionsContainer").append(videoSection);
    currentElement = videoSection;
}

function showDemoProjects(){

    if (currentElement == projectsSection){
        document.getElementById("sectionsContainer").removeChild(currentElement);
        currentElement = null;
        return;
    }
    
    if (currentElement != null)
        document.getElementById("sectionsContainer").removeChild(currentElement);

    document.getElementById("sectionsContainer").append(projectsSection);
    currentElement = projectsSection;
}

function showCV(){
    
    if (currentElement == curriculumSection){
        document.getElementById("sectionsContainer").removeChild(currentElement);
        currentElement = null;
        return;
    }
    
    if (currentElement != null)
        document.getElementById("sectionsContainer").removeChild(currentElement);

    document.getElementById("sectionsContainer").append(curriculumSection);
    currentElement = curriculumSection;
}

function openProject(id){
    console.log(id);
    switch (id) {
        case 0:
            window.location = "pages/navMesh.html"
            break;
    
        default:
            break;
    }
}