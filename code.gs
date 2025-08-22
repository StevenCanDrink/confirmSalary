function doGet() {
  return HtmlService.createTemplateFromFile("index").evaluate();
}

const spreadsheet_penalties_id = "1-zZtcEhASHiS48-yuVC5S0zhQqjaLKdF-vh4fw4rlf0";
const now = new Date();
const month = now.getMonth() + 1;
const year = now.getFullYear();
/**
 * staffInfo.real_name
 * staffInfo.birth_date
 * staffInfo.staff_id
 * **/

function getPenalties(staffInfo) {
  const staff_info = getStaffInfomation(staffInfo);

  const spreadsheet = SpreadsheetApp.openById(spreadsheet_penalties_id);
  const allSheets = spreadsheet.getSheets(); // Correct method name
  const columnToSearch = 1; // Column B (0=A, 1=B, ...)
  let results = [];

  for (const sheet of allSheets) {
    const data = sheet.getDataRange().getValues();

    for (let rowIndex = 0; rowIndex < data.length; rowIndex++) {
      const row = data[rowIndex];

      const sheetRow = rowIndex + 1;

      // If match real_name and staff_if
      if (staff_info.name == String(row[columnToSearch])) {
        const case_array = [row[5], row[6], row[7], row[8], row[9], row[10]];
        const caseNum = case_array.findIndex(
          (value) => value != null && value !== 0 && value !== ""
        );
        const reason =
          caseNum != 4
            ? penaltyReason(caseNum)
            : sheet.getRange(`K${rowIndex + 1}`).getValue();

        const output = {
          day: formatDateWithDash(row[4]),
          name: row[1],
          department: row[3],
          team: row[2],
          name: row[1],
          reason: reason,
          fee: case_array[caseNum],
        };
        results.push(Object.values(output));
        console.log(reason); //dev
      }
    }
    console.log("Found match! Stopping search.", results); //dev

    if (!!results) {
      return results;
    }
  }

  throw new Error("getPenalties empty");
}

async function getPenaltiesTotal(staffInfo) {
  const staff_info = getStaffInfomation(staffInfo);

  const spreadsheet = SpreadsheetApp.openById(spreadsheet_penalties_id);
  const allSheets = spreadsheet.getSheets(); // Correct method name
  const columnToSearch = 1; // Column B (0=A, 1=B, ...)

  let results = [];

  for (const sheet of allSheets) {
    const data = sheet.getDataRange().getValues();

    for (let rowIndex = 0; rowIndex < data.length; rowIndex++) {
      const row = data[rowIndex];

      const sheetRow = rowIndex + 1;

      // If match real_name and staff_if
      if (staff_info.name == String(row[columnToSearch])) {
        const case_array = [row[5], row[6], row[7], row[8], row[9], row[10]];
        const caseNum = case_array.findIndex(
          (value) => value != null && value !== 0 && value !== ""
        );
        const reason =
          caseNum != 4
            ? penaltyReason(caseNum)
            : sheet.getRange(`J${rowIndex + 1}`).getNote();

        const output = {
          day: row[4],
          department: row[3],
          team: row[2],
          name: row[1],
          reason: reason,
          fee: case_array[caseNum],
        };
        results.push(output);
      }
    }
    console.log("Found match! Stopping search.", results); //dev

    if (!!results) {
      return results
        .filter((item) => typeof item.fee === "number" && !isNaN(item.fee))
        .reduce((total, item) => total + item.fee, 0);
    }
  }

  throw new Error("getPenaltiesTotal empty");
}

async function getTimeSheetByName(staffInfo) {
  // 1. Get the active spreadsheet (or specify by ID/name)

  const [staff_info, sum_fee] = await Promise.all([
    getStaffInfomation(staffInfo),
    getPenaltiesTotal(staffInfo),
  ]);
  const spreadsheet = SpreadsheetApp.openById(
    "1hl5CWUdUUjiHQtwP13QqqbcU3UyUg45QQjJp91KXAJY"
  );

  console.log(month);
  const sheet = spreadsheet.getSheetByName(`Tháng ${month}/${year}`);
  // 3. Get all data as a 2D array

  const lastRow = sheet.getLastRow();
  const lastColumn = sheet.getLastColumn();

  const data = sheet.getRange(1, 1, lastRow, lastColumn).getValues();
  // 4. Find rows that match both criteria

  console.log(staff_info.name);

  // match real_name without space and accent
  const firstMatchIndex = data.findIndex((row) => {
    return String(row[1]) == staff_info.name;
  });

  if (firstMatchIndex == -1) {
    throw new Error("getTimeSheetByName Error");
  }

  const staff = data[firstMatchIndex];
  const rs = {
    name: staff[1],
    staff_id: staff_info.staff_id,
    department: staff[2],
    day_work: staff[36],
    OFF: staff[35],
    OT: staff[34],
    real_name: staff_info.real_name,
    confirm: staff[39] ?? "",
    confirm_day:
      sheet
        .getRange(`AM${firstMatchIndex + 1}`)
        .getNote()
        .replace("\n", "") ?? "",
    sum_fee: sum_fee,
    OT_PLUS: staff[37] == "" ? 0 : staff[37],
  };
  console.log(sum_fee);

  const rs_array = [
    rs.name,
    rs.staff_id,
    rs.department,
    rs.day_work,
    rs.OFF,
    rs.OT,
    rs.OT_PLUS,
    rs.confirm,
    rs.confirm_day,
    rs.sum_fee,
  ];
  console.log(rs_array);

  return rs_array;
}

function confirmSalary(staffInfo) {
  // 1. Get the active spreadsheet (or specify by ID/name)
  const staff_info = getStaffInfomation(staffInfo);

  const spreadsheet = SpreadsheetApp.openById(
    "1hl5CWUdUUjiHQtwP13QqqbcU3UyUg45QQjJp91KXAJY"
  );
  const sheet = spreadsheet.getSheetByName(`Tháng ${month}/${year}`);

  const lastRow = sheet.getLastRow();
  const lastColumn = sheet.getLastColumn();

  const data = sheet.getRange(1, 1, lastRow, lastColumn).getValues();

  const rowIndex = data.findIndex((row) => String(row[1]) == staff_info.name); //dev

  console.log("Final rowIndex:", rowIndex); // This should always log

  if (rowIndex == -1) {
    throw new Error("confirmSalary Error"); // Better to 'throw' than 'return' an Error
  }

  const sheetRow = rowIndex + 1;
  const staff = data[rowIndex];

  staff[39] = "✅ Đã xác nhận";
  sheet.getRange(sheetRow, 40).setNote(`Ngày ${formatDateWithTime(now)}`); //dev
  sheet.getRange(sheetRow, 1, 1, staff.length).setValues([staff]);
  return "Update Sucess";
}

function complain(staffInfo, complainInput) {
  // 1. Get the active spreadsheet (or specify by ID/name)
  const staff_info = getStaffInfomation(staffInfo);

  const spreadsheet = SpreadsheetApp.openById(
    "1hl5CWUdUUjiHQtwP13QqqbcU3UyUg45QQjJp91KXAJY"
  );
  const sheet = spreadsheet.getSheetByName(`Tháng ${month}/${year}`);

  const lastRow = sheet.getLastRow();
  const lastColumn = sheet.getLastColumn();
  const data = sheet.getRange(1, 1, lastRow, lastColumn).getValues();

  const rowIndex = data.findIndex((row) => String(row[1]) == staff_info.name); //dev

  if (rowIndex == -1) {
    throw new Error("complain Error"); // Better to 'throw' than 'return' an Error
  }

  const sheetRow = rowIndex + 1;
  const staff = data[rowIndex];

  staff[39] = "❌ Không xác nhận";
  sheet.getRange(sheetRow, 40).setNote(complainInput); //dev
  sheet.getRange(sheetRow, 1, 1, staff.length).setValues([staff]);
}

function formatDate(str) {
  const date = new Date(str);
  const dd = String(date.getDate()).padStart(2, "0");
  const mm = String(date.getMonth() + 1).padStart(2, "0"); // months are 0-based
  const yyyy = date.getFullYear();

  return dd + mm + yyyy;
}

function formatDateWithDash(str) {
  const date = new Date(str);
  const dd = String(date.getDate()).padStart(2, "0");
  const mm = String(date.getMonth() + 1).padStart(2, "0"); // months are 0-based
  const yyyy = date.getFullYear();

  return dd + "/" + mm + "/" + yyyy;
}

function formatDateWithTime(str) {
  const date = new Date(str);

  // Day, month, year
  const dd = String(date.getDate()).padStart(2, "0");
  const mm = String(date.getMonth() + 1).padStart(2, "0"); // months are 0-based
  const yyyy = date.getFullYear();

  // Hours and minutes
  const hh = String(date.getHours()).padStart(2, "0");
  const min = String(date.getMinutes()).padStart(2, "0");

  // Combine all components
  return dd + "/" + mm + "/" + yyyy + " " + hh + "h " + min + "p";
}

function getStaffInfomation(s) {
  // 1. Get the active spreadsheet (or specify by ID/name)
  const spreadsheet = SpreadsheetApp.openById(
    "11KCPDAE1ppyDfbrfuals5Etmsxo9WAUEIKFmQBP3hpo"
  );

  // const staffInfo = {real_name : "PHAMVANDONG",staff_id:"2686"}

  // const staffInfo = {real_name : "MAITRONGNHAN",staff_id:"381"}

  const staffInfo = { real_name: "NGUYENDUCHUY", staff_id: "591" };

  // const staffInfo = s

  const sheet = spreadsheet.getSheets()[0];
  // 3. Get all data as a 2D array

  const lastRow = sheet.getLastRow();
  const lastColumn = sheet.getLastColumn();

  const data = sheet.getRange(1, 1, lastRow, lastColumn).getValues();
  // 4. Find rows that match both criteria
  const safeStaffInfo = staffInfo || {};

  const real_name = staffInfo.real_name?.toUpperCase().trim() ?? "MAITRONGNHAN";
  const staff_id = staffInfo.staff_id ?? "381";

  console.log(staffInfo);

  // match real_name without space and accent
  const firstMatchIndex = data.findIndex(
    (row) =>
      String(row[4]).trim().replace(/\s+/g, "") == real_name &&
      String(row[1]) == staff_id
  );

  if (firstMatchIndex == -1) {
    throw new Error("getStaffInfomation Error");
  }

  const staff = data[firstMatchIndex];

  const rs = {
    name: staff[0],
    staff_id: staff[1],
    birth_date: formatDate(staff[2]),
    real_name: staff[3],
  };

  console.log(rs);
  return rs;
}

function penaltyReason(caseNumber) {
  switch (caseNumber) {
    case 0:
      return "Không Bấm Tay";
    case 1:
      return "Đi Trễ Về Sớm";
    case 2:
      return "Không Đeo Thẻ Nhân Viên";
    case 3:
      return "Vi phạm điều 4 chương 4";
    case 4:
      return "Không Cung Cấp File Công Việc";
    case 5:
      return "Xử Phạt Khác";
    default:
      return "";
  }
}
function include(filename) {
  return HtmlService.createHtmlOutputFromFile(filename).getContent();
}

function isNumber(value) {
  return typeof value === "number";
}
