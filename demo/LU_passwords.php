<!doctype html>
<html class=" js websqldatabase draganddrop cssscrollbar" lang="en">
<head>
<?php include('includes/LU_meta.php'); ?>
</head>
<body>
<div id="container" class="page">
	<div class="mad_event_event_bus"></div>
	<div id="js_app_controller" class="passbolt_controller_app_controller mad_view_view js_component ready">
	<?php include('includes/LU_loadingbar.php'); ?>
	<?php include('includes/LU_notifications.php'); ?>
	<?php include('includes/LU_header_first.php'); ?>
		<div class="header second">
			<?php include('includes/LU_header_second_logo.php'); ?>
			<?php include('includes/LU_header_search_passwords.php'); ?>
			<?php include('includes/LU_header_userbadge.php'); ?>
		</div>
		<div class="header third">
			<?php include('includes/LU_header_third_title_passwords.php'); ?>
			<?php include('includes/LU_header_third_actions_passwords.php'); ?>
		</div>
		<div id="js_app_panel_main" class="panel main mad_controller_component_tab_controller mad_view_component_tab js_component ready">
			<div class="js_tabs_content tabs-content">
				<div id="js_passbolt_passwordWorkspace_controller" class="passbolt_controller_password_workspace_controller mad_view_view tab-content ready selected">
					<div class="js_workspace">
						<div class="panel left">
							<?php include('includes/LU_nav_shortcuts_passwords.php'); ?>
							<?php include('includes/LU_nav_tree_passwords.php'); ?>
						</div>
						<div class="panel middle">
							<?php
							$_GET['breadcrumbs'] = array(
								'all passwords' => '../demo/LU_passwords.php'
							);
							include('includes/LU_breadcrumbs.php'); ?>
							<?php include('includes/LU_tableview_passwords.php'); ?>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
</div>
<?php include('includes/LU_footer.php'); ?>
</body>
</html>