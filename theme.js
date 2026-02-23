/* theme.css – Color schemes */
:root {
    --bg-primary: #ffffff;
    --bg-secondary: #f8fafd;
    --bg-tertiary: #e9eef3;
    --text-primary: #0a2a41;
    --text-secondary: #3d5e7a;
    --text-muted: #5f7d9c;
    --border-light: #e2eaf2;
    --border-medium: #bdd3e8;
    --accent-blue: #1d3a5c;
    --accent-light: #e2eaf2;
    --accent-hover: #0b2a41;
    --online-green: #31b057;
    --message-mine: #1d3a5c;
    --message-theirs: #e9eef3;
}

[data-theme="dark"] {
    --bg-primary: #1a2634;
    --bg-secondary: #1f2c3a;
    --bg-tertiary: #2a3848;
    --text-primary: #e9eef3;
    --text-secondary: #bdd3e8;
    --text-muted: #8fa6c0;
    --border-light: #2f4052;
    --border-medium: #40566b;
    --accent-blue: #4a7a9c;
    --accent-light: #2f4052;
    --accent-hover: #6a8eb0;
    --message-mine: #2f4052;
    --message-theirs: #1f2c3a;
}

@media (prefers-color-scheme: dark) {
    [data-theme="auto"] {
        --bg-primary: #1a2634;
        --bg-secondary: #1f2c3a;
        --bg-tertiary: #2a3848;
        --text-primary: #e9eef3;
        --text-secondary: #bdd3e8;
        --text-muted: #8fa6c0;
        --border-light: #2f4052;
        --border-medium: #40566b;
        --accent-blue: #4a7a9c;
        --accent-light: #2f4052;
        --accent-hover: #6a8eb0;
        --message-mine: #2f4052;
        --message-theirs: #1f2c3a;
    }
}
