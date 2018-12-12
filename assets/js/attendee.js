// "use strict";
// import { escapeHTML } from "helpers.js";

let AttendeeRenderType = Object.freeze({
    ATTENDEE_LIST: 1,
    ACCEPTED_LIST: 2,
    UNACCEPTED_LIST: 3,
});

class Attendee {
  constructor(obj) {
    this.data = {};
    this.data.user_id = obj.user_id;
    this.data.first_name = obj.first_name;
    this.data.surname = obj.surname;
    this.data.email = obj.email;
    this.data.age = obj.age;
    this.data.school = obj.school;
    this.data.grade = obj.grade;
    this.data.student_phone_number = obj.student_phone_number;
    this.data.guardian_name = obj.guardian_name;
    this.data.guardian_email = obj.guardian_email;
    this.data.guardian_phone_number = obj.guardian_phone_number;
    this.data.gender = obj.gender;
    this.data.tshirt_size = obj.tshirt_size;
    this.data.previous_hackathons = obj.previous_hackathons;
    this.data.github_username = obj.github_username;
    this.data.linkedin_profile = obj.linkedin_profile;
    this.data.dietary_restrictions = obj.dietary_restrictions;
    this.data.signed_waiver = obj.signed_waiver;
    this.data.acceptance_status = obj.acceptance_status;
    this.data.email_verified = obj.email_verified;
    this.data.timestamp = obj.timestamp;

    this.elements = {};
  }

  render(renderType) {
    if (!this.elements[renderType]) {
      this.elements[renderType] = document.createElement("div");
      this.elements[renderType].classList.add("attendees-row");
      this.elements[renderType].setAttribute("data-id", this.data.user_id);
    }

    let procData = {};
    Object.keys(this.data).forEach(key => {
      procData[key] = escapeHTML(String(this.data[key]));
    });

    this.elements[renderType].innerHTML = `
    <details>
        <summary title="${procData.first_name + " " + procData.surname + " <" + procData.user_id + ">"}">
            ${(() => {
                switch (renderType) {
                    case AttendeeRenderType.ATTENDEE_LIST:
                        return "<span class='delete-icon'><span title='Delete Attendee'><img src='/assets/icons/close.svg'></span></span>";
                    case AttendeeRenderType.ACCEPTED_LIST:
                        return "<span class='unaccept-icon'><span title='Remove Attendee From Queue'><img src='/assets/icons/user-unaccept.svg'></span></span>";
                    default:
                        return "";
                }
            })()}
            <ul>
                ${renderType == AttendeeRenderType.UNACCEPTED_LIST ?
                    '<li class="acceptance-checkbox"><input class="accept" type="checkbox"></li>':
                    `<li>${
                        procData.acceptance_status.charAt(0).toUpperCase() + procData.acceptance_status.substr(1)
                    }</li>`
                }
                <li>${procData.first_name}</li>
                <li>${procData.surname}</li>
                <li>${procData.email}</li>
                <li>${new Date(
                  procData.timestamp.replace(" ", "T") + "Z"
                ).toDateString()}</li>
            </ul>
        </summary>
        <div class="attendees-details">
            <ul>
                <li><b>Gender:</b>${procData.gender}</li>
                <li><b>Age:</b>${procData.age}</li>
                <li><b>School:</b>${procData.school}</li>
                <li><b>Grade:</b>${procData.grade}</li>
                <li><b>Phone Number:</b>${procData.student_phone_number}</li>
                <li><b>T-Shirt Size:</b>${procData.tshirt_size}</li>
                <li><b>Previous Hackathons:</b>${
                  procData.previous_hackathons
                }</li>
            </ul>
            <ul>
                <li><b>Guardian Name:</b>${procData.guardian_name}</li>
                <li><b>Guardian Email:</b>${procData.guardian_email}</li>
                <li><b>Guardian Phone Number:</b>${
                  procData.guardian_phone_number
                }</li>
            </ul>
            <ul>
                <li><b>GitHub Username:</b>${procData.github_username}</li>
                <li><b>LinkedIn Profile:</b>${procData.linkedin_profile}</li>
                <li><b>Dietary Restrictions:</b>${
                  procData.dietary_restrictions
                }</li>
            </ul>
            <span class='edit-icon'><span title='Edit Attendee Data'>
                    <img src='/assets/icons/user-edit.svg'>
            </span></span>
            <span class='history-icon'><span title='View Edit History'>
                <img src='/assets/icons/history.svg'>
            </span></span>
        </div>
    </details>`;
  }

  getElement(renderType) {
    if (!this.elements[renderType]) {
      this.render(renderType);
    }
    return this.elements[renderType];
  }
}
