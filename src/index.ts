type UserInfoType = {
    name: string,
    login: string,
    avatar_url: string,
    location: string,
    public_repos: number
}


async function main() {
    try {
        const userId = getUserId();
        const userInfo: UserInfoType = await fetchUserInfo(userId)
        const view = createView(userInfo);
        displayView(view)
    } catch (error) {
        console.log(`エラーが発生しました。(${error})`)
    }
}
window.main = main;

function getUserId(): string{
    const el: HTMLInputElement | null = document.querySelector("input[id='userId']");
    if (!el) throw new Error("userIdをidにもつ要素が見つかりませんでした。")
    return el.value;
}

function fetchUserInfo(userId: string): Promise<UserInfoType> {
    return fetch(`https://api.github.com/users/${encodeURIComponent(userId)}`)
        .then(response => {
            console.log(response.status);
            // エラーレスポンスを検知する
            if (!response.ok) {
                return Promise.reject(
                    new Error(`${response.status}: ${response.statusText}`)
                );
            } else {
                return response.json();
            }
        });
}

function createView(userInfo: UserInfoType): string {
    return escapeHTML`
    <h4>${userInfo.name} (@${userInfo.login})</h4>
    <img src="${userInfo.avatar_url}" alt="${userInfo.login}" height="100">
    <dl>
        <dt>Location</dt>
        <dd>${userInfo.location}</dd>
        <dt>Repositories</dt>
        <dd>${userInfo.public_repos}</dd>
    </dl>
    `;
}

function displayView(view: string) {
    // HTMLの挿入
    const result = document.getElementById("result");
    if (!result) {
        throw new Error("resultをidにもつ要素が見つかりませんでした。")
    }
    result.innerHTML = view;
}

function escapeSpecialChars(str: string) {
    return str
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}

function escapeHTML(strings: TemplateStringsArray, ...values: (string | number)[]) {
    return strings.reduce((result, str, i) => {
        const value = values[i - 1];
        if (typeof value === "string") {
            return result + escapeSpecialChars(value) + str;
        } else {
            return result + String(value) + str;
        }
    });
}