"""
This version is currently not made for heavy use since it fetches all data at every reload.
Later versions will cache most data and store all data in a session.
"""
import os
import config
from datetime import timedelta

from flask import Flask, redirect, url_for, render_template, request, session
from flask_discord import DiscordOAuth2Session, requires_authorization, Unauthorized
from flask_pymongo import PyMongo


app = Flask(__name__)

app.secret_key = config.SECRET_KEY
app.permanent_session_lifetime = timedelta(hours=12)
os.environ["OAUTHLIB_INSECURE_TRANSPORT"] = "true"

app.config["DISCORD_CLIENT_ID"] = config.DISCORD_CLIENT_ID
app.config["DISCORD_CLIENT_SECRET"] = config.DISCORD_CLIENT_SECRET
app.config["DISCORD_REDIRECT_URI"] = config.DISCORD_REDIRECT_URI
app.config["DISCORD_BOT_TOKEN"] = config.DISCORD_BOT_TOKEN

app.config["MONGO_URI"] = config.MONGODB_URI

mongo = PyMongo(app)
db = mongo.db

discord = DiscordOAuth2Session(app)


def user_is_logged_in():
    return False if discord.get_authorization_token() is None else True


def get_guilds():
    if "guilds" not in session:
        guilds = discord.fetch_guilds()
        guilds_dict = {}

        for guild in guilds:
            if guild.permissions.administrator:
                guild_document = db.guilds.find_one({"guildId": str(guild.id)})

                guilds_dict[f"{guild.id}"] = {
                    "guild_id": guild.id,
                    "guild_name": f"{guild.name}",
                    "guild_icon": f"{guild.icon_url or 'https://cdn.discordapp.com/embed/avatars/0.png'}",
                    "client_is_invited": True if guild_document else False,
                    "user_is_admin": guild.permissions.administrator,
                }
        session["guilds"] = guilds_dict
    return session["guilds"]


def get_guild(guild_id):
    guilds = get_guilds()
    for guild in guilds:
        if guilds[guild]["guild_id"] == guild_id and guilds[guild]["user_is_admin"]:
            guild_document = db.guilds.find_one(
                {"guildId": str(guilds[guild]["guild_id"])}
            )

            if guild_document is not None:
                return guilds[guild], guild_document
            break
    return None, None


@app.route("/index")
@app.route("/")
def index():
    return render_template("homepage.html", logged_in=user_is_logged_in())


@app.route("/privacy-policy")
def privacy_policy():
    return render_template("privacy-policy.html", logged_in=user_is_logged_in())


@app.route("/terms-of-service")
def terms_of_service():
    return render_template("terms-of-service.html", logged_in=user_is_logged_in())


@app.route("/invite")
def invite():
    return discord.create_session(scope=["bot"], permissions=8)


@app.route("/invite/<int:guild_id>")
def invite_guild(guild_id):
    return discord.create_session(scope=["bot"], permissions=8, guild_id=guild_id)


@app.route("/login")
def login():
    if discord.get_authorization_token() is not None:
        return redirect(url_for("dashboard"))
    return discord.create_session()


@app.route("/logout")
def logout():
    session.pop("guilds", None)
    discord.revoke()
    return redirect(url_for(".index"))


@app.route("/callback")
def callback():
    if request.args.get("error", default="", type=str) != "":
        return redirect(url_for(".index"))
    else:
        discord.callback()
        return redirect(url_for(".dashboard"))


@app.errorhandler(Unauthorized)
def redirect_unauthorized(e):
    return redirect(url_for("index"))


@app.route("/dashboard")
@requires_authorization
def dashboard():
    user = discord.fetch_user()
    all_guilds = get_guilds()

    return render_template(
        "dashboard.html", logged_in=True, user=user, guilds=all_guilds
    )


@app.route("/dashboard/<int:guild_id>")
@requires_authorization
def guild(guild_id):
    guild, guild_data = get_guild(guild_id)

    if guild is None:
        return "NOT AUTHORIZED"

    return render_template(
        "dash-homepage.html", logged_in=True, guild=guild, data=guild_data
    )


@app.route("/dashboard/<int:guild_id>/commands")
@requires_authorization
def guild_commands(guild_id):
    user = discord.fetch_user()
    guild = get_guild(guild_id)

    if guild is None:
        return "NOT AUTHORIZED"

    return render_template("dash-commands.html", logged_in=True, user=user, guild=guild)


@app.route("/dashboard/<int:guild_id>/logs")
@requires_authorization
def guild_serverlogs(guild_id):
    user = discord.fetch_user()
    guild = get_guild(guild_id)

    if guild is None:
        return "NOT AUTHORIZED"

    return render_template(
        "dash-serverlogs.html", logged_in=True, user=user, guild=guild
    )


@app.route("/dashboard/<int:guild_id>/donate")
@requires_authorization
def guild_donate(guild_id):
    user = discord.fetch_user()
    guild = get_guild(guild_id)

    if guild is None:
        return "NOT AUTHORIZED"

    return render_template("dash-donate.html", logged_in=True, user=user, guild=guild)


if __name__ == "__main__":
    app.run(debug=True)
